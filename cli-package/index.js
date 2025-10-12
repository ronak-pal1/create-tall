#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const REPO_URL = "https://github.com/ronak-pal1/create-tall.git";
const BRANCH = "main";

async function main() {
  console.log("\n🚀 Welcome to create-tall (create template all) \n");

  // --- Step 1: Ask project name ---
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input) =>
        input.trim() ? true : "Project name cannot be empty.",
    },
  ]);

  // --- Step 2: Ask for frontend template ---
  const { frontend } = await inquirer.prompt([
    {
      type: "list",
      name: "frontend",
      message: "Choose your frontend template:",
      choices: ["react-app", "next-app", "react-redux-app", "none"],
    },
  ]);

  // --- Step 3: Ask for backend template ---
  const { backend } = await inquirer.prompt([
    {
      type: "list",
      name: "backend",
      message: "Choose your backend template:",
      choices: ["express-app", "fastify-app", "nest-app", "none"],
    },
  ]);

  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`❌ Folder '${projectName}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath);
  process.chdir(projectPath);

  console.log(`\n📁 Creating project in '${projectName}'...`);

  // --- Step 4: Initialize Git ---
  execSync("git init -q");

  // --- Step 5: Add remote ---
  execSync(`git remote add origin ${REPO_URL}`);

  // --- Step 6: Enable sparse-checkout ---
  execSync("git sparse-checkout init --cone");

  // --- Step 7: Set paths dynamically based on choices ---
  const foldersToFetch = [];
  if (frontend !== "none") foldersToFetch.push(frontend);
  if (backend !== "none") foldersToFetch.push(backend);
  execSync(`git sparse-checkout set ${foldersToFetch.map(f => `templates/${f}`).join(" ")}`);


  // --- Step 8: Pull from repo ---
  console.log("⬇️  Pulling selected templates...");
  execSync(`git pull origin ${BRANCH}`, { stdio: "inherit" });

  // --- Step 9: Move folders into structure ---
  if (frontend !== "none" && fs.existsSync(frontend)) {
    fs.renameSync(frontend, "client");
  }
  if (backend !== "none" && fs.existsSync(backend)) {
    fs.renameSync(backend, "server");
  }

  // --- Step 10: Cleanup ---
  execSync("rm -rf .git");

  console.log("\n✅ Setup complete!");
  console.log(`\n📦 Folder structure:\n`);
  console.log(`${projectName}/`);
  if (frontend !== "none") console.log(" ├── client/   (frontend)");
  if (backend !== "none") console.log(" └── server/   (backend)");
  console.log("\n🚀 Ready to build!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
