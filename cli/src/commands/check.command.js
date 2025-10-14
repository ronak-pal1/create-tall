import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const checkCommand = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const pkgPath = path.join(__dirname, "../../package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

  const program = new Command();

  program
    .name("create-tall")
    .description("CLI to create any stack apps easily")
    .version(pkg.version)
    .usage("create-tall <command> [options]\n")
    .option("-p, --project <name>", "specify project name")
    .option("-f, --frontend <name>", "specify frontend template")
    .option("-b, --backend <name>", "specify backend template")
    .option("--cicd", "include CI/CD setup using GitHub Actions")
    .option("--prompt", "All in one prompt mode for whole project setup")
    .parse(process.argv);

  const options = program.opts();

  let { project, frontend, backend, cicd, prompt } = options;

  if (prompt) {
    project = frontend = backend = cicd = null;

    const otherFlags = Object.entries(options).filter(
      ([key, val]) => key !== "prompt" && val !== undefined
    );

    if (otherFlags.length > 0) {
      console.error("❌ The --prompt flag cannot be used with other options.");
    }

    return { project, frontend, backend, cicd, prompt };
  }

  return { project, frontend, backend, cicd, prompt };
};

export default checkCommand;
