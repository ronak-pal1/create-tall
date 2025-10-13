import { promptProjectName, promptFrontend, promptBackend, promptCICD } from "./prompts/index.js";
import { initGitRepo, setSparseCheckout, pullTemplates } from "./git/git.utils.js";
import { renameStructure } from "./setup/structure.setup.js";
import { setupCICD } from "./setup/cicd.setup.js";
import { cleanup } from "./setup/cleanup.js";
import fs from "fs";
import path from "path";
import { logStep } from "./utils/logger.js";
import { completionLog } from "./setup/complete.setup.log.js";

export async function main() {
  console.log("\n🚀 Welcome to New create-tall (Create Template All)\n");

  const projectName = await promptProjectName();
  const frontend = await promptFrontend();
  const backend = await promptBackend();
  const { needCICD, cicdTemplates } = await promptCICD();

  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(`❌ Folder '${projectName}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath);
  process.chdir(projectPath);

  logStep("📁 Creating project structure...");

  await initGitRepo();
  await setSparseCheckout(frontend, backend, needCICD);
  await pullTemplates();

  renameStructure(frontend, backend);
  await setupCICD(needCICD, cicdTemplates);

  cleanup();

  completionLog(projectName, frontend, backend, needCICD)
}

main();
