import inquirer from "inquirer";

export async function promptProjectName() {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input) =>
        input ? true : "Project name cannot be empty.",
    },
  ]);

  return projectName;
}
