import { execSync } from "child_process";
import fs from "fs"

export function cleanup() {
  ["README.md", "package.json", ".gitignore", "LICENSE"].forEach((file) => {
    if (fs.existsSync(file)) fs.rmSync(file, { force: true });
  });

  execSync("rm -rf .git github-actions", { stdio: "ignore" });
}
