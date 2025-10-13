import { execSync } from "child_process";
import { REPO_URL, BRANCH } from "./repo.config.js";

export function runGit(command, errorMessage) {
  try {
    execSync(command, { stdio: "pipe" });
  } catch {
    console.error(`❌ ${errorMessage}`);
    process.exit(1);
  }
}

export async function initGitRepo() {
  runGit("git init -q", "Git initialization failed");
  runGit(`git remote add origin ${REPO_URL}`, "Failed to add remote");
}

export async function setSparseCheckout(frontend, backend, needCICD) {
  runGit("git sparse-checkout init --cone", "Failed to enable sparse-checkout");

  const folders = [];
  if (frontend !== "none") folders.push(`templates/${frontend}`);
  if (backend !== "none") folders.push(`templates/${backend}`);
  if (needCICD) folders.push("github-actions");

  runGit(`git sparse-checkout set ${folders.join(" ")}`, "Failed to set sparse paths");
}

export async function pullTemplates() {
  runGit(`git pull origin ${BRANCH}`, "Git pull failed");
}
