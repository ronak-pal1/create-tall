import { promptProjectName, promptFrontend, promptBackend, promptCICD } from "./prompts/index.js";
import { initGitRepo, setSparseCheckout, pullTemplates } from "./git/git.utils.js";
import { renameStructure } from "./setup/structure.setup.js";
import { setupCICD } from "./setup/cicd.setup.js";
import { cleanup } from "./setup/cleanup.js";
import fs from "fs";
import path from "path";
import { logStep } from "./utils/logger.js";
import { completionLog } from "./setup/complete.setup.log.js";
import { printBanner } from "./utils/print.banner.js";
import checkCommand from "./commands/check.command.js";
import { frontendTemplates } from "./prompts/frontend.prompt.js";
import { backendTemplates } from "./prompts/backend.prompt.js";

export async function main() {
  const { project: cmdProject, frontend: cmdFrontend, backend: cmdBackend, cicd: cmdCICD, prompt: cmdPrompt } = checkCommand();

  printBanner("Create    Tall");
  console.log("\n🚀 Welcome to create-tall CLI (Create Template All CLI)\n");


  const projectName = cmdProject || await promptProjectName();
  const frontend = cmdFrontend || await promptFrontend();
  const backend = cmdBackend || await promptBackend();


  if (!frontend && !backend) {
    console.error("❌ Please select at least one frontend or backend template.");
    process.exit(1);
  }

  const frontendTags = frontendTemplates.find((template) => template.value === frontend)?.tags;
  const backendTags = backendTemplates.find((template) => template.value === backend)?.tags;


  const { needCICD, cicdTemplates } = await promptCICD(cmdCICD, frontendTags, backendTags);

  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(`❌ Folder '${projectName}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath);
  process.chdir(projectPath);

  logStep("📁 Creating project structure...\n");

  await initGitRepo();
  await setSparseCheckout(frontend, backend, needCICD);
  await pullTemplates();

  renameStructure(frontend, backend);
  await setupCICD(needCICD, cicdTemplates);

  cleanup();

  completionLog(projectName, frontend, backend, needCICD)
}

main().catch((error) => {
  process.exit(1);
});
