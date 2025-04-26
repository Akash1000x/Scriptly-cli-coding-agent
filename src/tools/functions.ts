import tree from "tree-node-cli";
import fs from 'fs'
import path from 'path'
import { execSync } from "child_process";

export function get_project_tree_structure() {
  const projectTree = tree(".", {
    allFiles: true,
    exclude: [/node_modules/, /lcov/, /.git/, /dist/],
  })
  if (!projectTree) {
    return "No project tree found"
  }

  return projectTree
}

export function write_code(filePath: string, code: string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filePath, code);
  return "File written successfully"
}

export function edit_code(filePath: string, newCode: string) {
  if (!fs.existsSync(filePath)) {
    return "File does not exist"
  }
  fs.writeFileSync(filePath, newCode)
  return "File edited successfully"
}

export function delete_file(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return "File does not exist"
  }
  fs.unlinkSync(filePath)
  return "File deleted successfully"
}

export function create_file_or_folder(filePath: string, type: "file" | "folder") {
  if (fs.existsSync(filePath)) {
    return "File already exists"
  }
  if (type === "file") {
    fs.writeFileSync(filePath, "")
  } else {
    fs.mkdirSync(filePath, { recursive: true })
  }
  return "File created successfully"
}

export function run_command(command: string) {
  const result = execSync(command)
  return result.toString()
}

export function get_file_content(filepath: string) {
  if (!fs.existsSync(filepath)) {
    return "File does not exist"
  }
  return fs.readFileSync(filepath, "utf-8")
}

export function get_file_path(fileName: string) {
  const files = fs.readdirSync(process.cwd())
  return files.find(file => file === fileName) || "File does not exist"
}
