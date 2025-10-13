import fs from "fs";
import path from "path";

export async function setupCICD(needCICD, cicdTemplates) {
  if (!(needCICD && fs.existsSync("github-actions"))) {
    return;
  }

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
