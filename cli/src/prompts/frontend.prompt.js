import inquirer from "inquirer";

export const frontendTemplates = [
  {
    name: "React.js + TypeScript",
    value: "react-app",
    tags: ["typescript", "react"],
  },
  {
    name: "Next.js + TypeScript",
    value: "next-app",
    tags: ["typescript", "nextjs"],
  },
];


export async function promptFrontend() {

  const choices = [...frontendTemplates.map((template) => template.name), "None"];

  const { frontend } = await inquirer.prompt([
    {
      type: "list",
      name: "frontend",
      message: "Choose your frontend template:",
      choices,
    },
  ]);

  if (frontend === "None") {
    return null;
  }

  const template = frontendTemplates.find((template) => template.name === frontend);

  return template.value;
}
