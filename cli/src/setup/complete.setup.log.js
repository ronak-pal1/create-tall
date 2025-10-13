export function completionLog(projectName, frontend, backend, needCICD) {
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
