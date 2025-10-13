import fs from "fs";

export function renameStructure(frontend, backend) {
  if (frontend !== "none" && fs.existsSync(`templates/${frontend}`)) {
    fs.renameSync(`templates/${frontend}`, "client");
  }

  if (backend !== "none" && fs.existsSync(`templates/${backend}`)) {
    fs.renameSync(`templates/${backend}`, "server");
  }

  if (fs.existsSync("templates")) {
    fs.rmSync("templates", { recursive: true, force: true });
  }
}
