#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const REPO_URL = "https://github.com/ronak-pal1/create-tall";
const BRANCH = "main";

async function main() {
  console.log("\n🚀 Welcome to create-tall (Create Template All)\n");

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
      choices: ["react-app", "none"],
    },
  ]);

  // --- Step 3: Ask for backend template ---
  const { backend } = await inquirer.prompt([
    {
      type: "list",
      name: "backend",
      message: "Choose your backend template:",
      choices: ["express-app", "none"],
    },
  ]);

  // --- Step 4: Ask for CI/CD need ---
  const { needCICD } = await inquirer.prompt([
    {
      type: "confirm",
      name: "needCICD",
      message: "Do you want to set up CI/CD workflow?",
      default: false,
    },
  ]);

  // --- Step 5: If yes, ask which CI/CD template ---
  let cicdTemplates = null;
  if (needCICD) {
    const { cicdChoices } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "cicdChoices",
        message: "Choose a CI/CD template:",
        choices: [
          "reactjs-cloudfront-deploy",
          "nextjs-cloudfront-deploy",
          "express-ec2-server-deploy",
        ],
      },
    ]);
    cicdTemplates = cicdChoices;
  }

  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`❌ Folder '${projectName}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath);
  process.chdir(projectPath);

  console.log(`\n📁 Creating project in '${projectName}'...`);

  // --- Step 6: Initialize Git ---
  execSync("git init -q");

  // --- Step 7: Add remote ---
  execSync(`git remote add origin ${REPO_URL}`);

  // --- Step 8: Enable sparse-checkout ---
  execSync("git sparse-checkout init --cone");

  // --- Step 9: Set paths dynamically based on choices ---
  const foldersToFetch = [];
  if (frontend !== "none") foldersToFetch.push("templates/" + frontend);
  if (backend !== "none") foldersToFetch.push("templates/" + backend);
  if (needCICD) foldersToFetch.push("github-actions");
  execSync(`git sparse-checkout set ${foldersToFetch.join(" ")}`);

  // --- Step 10: Pull from repo ---
  console.log("⬇️  Pulling selected templates...");
  try {
    execSync(`git pull origin ${BRANCH}`, { stdio: "ignore" });
  } catch (err) {
    console.error("❌ Git pull failed.");
  }

  // cleanup unwanted root files
  ["README.md", "package.json", ".gitignore", "LICENSE"].forEach((file) => {
    if (fs.existsSync(file)) fs.rmSync(file, { force: true });
  });

  // --- Step 11: Rename structure (move out of templates folder) ---
  if (frontend !== "none" && fs.existsSync(`templates/${frontend}`)) {
    fs.renameSync(`templates/${frontend}`, "client");
  }

  if (backend !== "none" && fs.existsSync(`templates/${backend}`)) {
    fs.renameSync(`templates/${backend}`, "server");
  }

  // optional: cleanup the now-empty templates folder
  if (fs.existsSync("templates")) {
    fs.rmSync("templates", { recursive: true, force: true });
  }

  // --- Step 12: Setup CI/CD Workflows ---

  if (needCICD && fs.existsSync("github-actions")) {
    console.log("⚙️  Setting up GitHub Actions workflows...");

    const workflowsDir = path.join(".github", "workflows");
    if (!fs.existsSync(workflowsDir))
      fs.mkdirSync(workflowsDir, { recursive: true });

    // assume 'cicdTemplates' is an array of selected templates
    cicdTemplates.forEach((template, index) => {
      const templatePath = path.join("github-actions", `${template}.yaml`);
      if (!fs.existsSync(templatePath)) {
        console.warn(`⚠️  Skipping missing template: ${templatePath}`);
        return;
      }

      // Determine if it's a server or client deploy
      const isServer = template.toLowerCase().includes("server");

      // Decide target file name (prevent overwrite if multiple)
      let baseName = isServer ? "deploy-server" : "deploy-client";
      let targetName = `${baseName}.yaml`;

      // If that target already exists, append index
      let counter = 2;
      while (fs.existsSync(path.join(workflowsDir, targetName))) {
        targetName = `${baseName}-${counter}.yaml`;
        counter++;
      }

      // Copy the file
      fs.copyFileSync(templatePath, path.join(workflowsDir, targetName));
      console.log(
        `✅ Added ${template} → ${path.join(workflowsDir, targetName)}`
      );
    });

    console.log("🎉 GitHub Actions setup complete!");
  }

  // --- Step 13: Cleanup ---
  execSync("rm -rf .git github-actions", { stdio: "ignore" });

  console.log("\n✅ Setup complete!");
  console.log(`\n📦 Folder structure:\n`);
  console.log(`${projectName}/`);
  if (frontend !== "none") console.log(" ├── client/   (frontend)");
  if (backend !== "none") console.log(" ├── server/   (backend)");
  if (needCICD) console.log(" └── .github/workflows/ (CI/CD)");

  console.log("\n Please do the following:");
  console.log("cd client && npm install");
  console.log("cd server && npm install");
  console.log("\n🚀 Ready to build!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
