import inquirer from "inquirer";


export const backendTemplates = [
  {
    name: "Express.js + TypeScript",
    value: "express-app",
    tags: ["typescript", "express"],
  },
];

export async function promptBackend() {
  const choices = [...backendTemplates.map((template) => template.name), "None"];

  const { backend } = await inquirer.prompt([
    {
      type: "list",
      name: "backend",
      message: "Choose your backend template:",
      choices,
    },
  ]);

  if (backend === "None") {
    return null;
  }

  const template = backendTemplates.find((template) => template.name === backend);

  return template.value;
}
