import inquirer from "inquirer";

export async function promptFrontend() {
  const { frontend } = await inquirer.prompt([
    {
      type: "list",
      name: "frontend",
      message: "Choose your frontend template:",
      choices: ["react-app", "None"],
    },
  ]);

  return frontend;
}
