#!/usr/bin/env node
import chalk from "chalk";
import dotenv from "dotenv";
import OpenAI from "openai";
import { ResponseInput } from "openai/resources/responses/responses";
import readline from "readline";
import { systemPrompt } from "./system_prompt";
import { call_tools, tools } from "./tools";

dotenv.config();

const log = console.log;

const client = new OpenAI();
// {
//   apiKey: process.env.GOOGLE_API_KEY,
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
// }


async function main() {
  log(chalk.cyan.bold.bgYellow("Welcome to Scriptly CLI"));
  log("\n");

  const input_message: ResponseInput = [
    { role: "system", content: systemPrompt },
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  while (true) {
    const userPrompt = await new Promise<string>((resolve) => {
      rl.question(chalk.blue("Enter your prompt>> "), resolve);
    });

    if (!userPrompt) break;

    input_message.push({ role: "user", content: userPrompt });

    while (true) {
      try {
        const response = await client.responses.create({
          model: "gpt-4.1",
          input: input_message,
          tools: tools,
          text: {
            format: {
              "type": "json_object",
            },
          },
        });

        const toolCall = response.output[0];

        if (toolCall.type === "function_call") {
          input_message.push(toolCall);

          const toolName = toolCall.name;
          const toolArgs = JSON.parse(toolCall.arguments);

          log(chalk.magenta(`=========================== ${toolName.split("_").join(" ").toUpperCase()} ===========================`));

          log(chalk.blue("Tool call: ", chalk.red(toolName)));
          log(chalk.blue("Tool args: ", chalk.red(toolCall.arguments)));

          const result = call_tools(toolName, toolArgs);
          input_message.push({
            type: "function_call_output",
            call_id: toolCall.call_id,
            output: result?.toString() || "",
          });
          log(chalk.blue("Tool call output: ", chalk.green(result?.toString())));
          log(chalk.magenta('============================================================================='));
        }

        if (response.output_text) {
          try {
            const output = JSON.parse(response.output_text);
            input_message.push({ role: "assistant", content: response.output_text });
            log(chalk.blue("response: ", chalk.white(output.message)));
            if (output.type === "complete" || output.type === "query") {
              break;
            }
          } catch (error) {
            log(chalk.red("Error parsing response: ", error));
            log(chalk.yellow("Raw response: ", response.output_text));
            break;
          }
        }
      } catch (error) {
        log(chalk.red("Error: ", error));
        rl.close();
        return
      }
    }
  }
  rl.close();
}

main();
