import inquirer from "inquirer";

export async function promptBackend() {
  const { backend } = await inquirer.prompt([
    {
      type: "list",
      name: "backend",
      message: "Choose your backend template:",
      choices: ["express-app", "None"],
    },
  ]);

  return backend;
}
