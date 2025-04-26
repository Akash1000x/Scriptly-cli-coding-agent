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
  const input_message: ResponseInput = [
    { role: "system", content: systemPrompt },
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  while (true) {
    const userPrompt = await new Promise<string>((resolve) => {
      rl.question(chalk.blue("Enter your prompt >> "), resolve);
    });

    if (!userPrompt) break;

    input_message.push({ role: "user", content: userPrompt });

    while (true) {
      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: input_message,
        tools: tools,
      });

      const toolCall = response.output[0];
      input_message.push(toolCall);

      if (toolCall.type === "function_call") {
        
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

      if(response.output_text){
        log(chalk.blue("response: ", chalk.white(response.output_text)));
      }

      if (response.output_text === "stop") {
        break;
      }
    }
  }
  rl.close();
}

main();
