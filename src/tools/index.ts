import { FunctionTool } from "openai/resources/responses/responses";
import {
  create_file_or_folder,
  delete_file,
  edit_code,
  get_file_content,
  get_file_path,
  get_project_tree_structure,
  run_command,
  write_code,
} from "./functions";

export function call_tools(toolName: string, toolArgs: any) {
  switch (toolName) {
    case "get_project_tree_structure":
      return get_project_tree_structure();
    case "write_code":
      return write_code(toolArgs.filePath, toolArgs.code);
    case "edit_code":
      return edit_code(toolArgs.filePath, toolArgs.newCode);
    case "delete_file":
      return delete_file(toolArgs.filePath);
    case "create_file_or_folder":
      return create_file_or_folder(toolArgs.filePath, toolArgs.type);
    case "run_command":
      return run_command(toolArgs.command);
    case "get_file_content":
      return get_file_content(toolArgs.filePath);
    case "get_file_path":
      return get_file_path(toolArgs.fileName);
    default:
      return "Tool not found";
  }
}

export const tools: FunctionTool[] = [
  {
    type: "function",
    name: "get_project_tree_structure",
    description: "Get current project directory structure in tree format.",
    strict: true,
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "write_code",
    description: "Write code in a file for the current project.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path of the file to write the code to.",
        },
        code: {
          type: "string",
          description: "The code to write to the file.",
        },
      },
      required: ["filePath", "code"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "edit_code",
    description:
      "Edit code in a file for the current project(if you need to edit the file you have to give the full file content with the changes you want to make, you can't just give the changes you want to make)",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path of the file to edit.",
        },
        newCode: {
          type: "string",
          description: "The full file content with the changes you want to make.",
        },
      },
      required: ["filePath", "newCode"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "delete_file",
    description: "Delete a file from the current project.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path of the file to delete.",
        },
      },
      required: ["filePath"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "create_file_or_folder",
    description: "Create a file or folder in the current project.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path of the file or folder to create.",
        },
        type:{
          type: "string",
          description: "The type of the file or folder to create.",
          enum: ["file", "folder"],
        },
      },
      required: ["filePath", "type"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "run_command",
    description: "Run a command in cli of the current project.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The command to run in cli.",
        },
      },
      required: ["command"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_file_content",
    description: "Get the content of a file from the current project.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path of file to get the content of it.",
        },
      },
      required: ["filePath"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_file_path",
    description: "Get the path of a file from the current project.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        fileName: {
          type: "string",
          description: "The name of the file to get the path of it.",
        },
      },
      required: ["fileName"],
      additionalProperties: false,
    },
  },
];