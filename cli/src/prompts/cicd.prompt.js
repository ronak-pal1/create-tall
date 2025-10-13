import inquirer from "inquirer";

export async function promptCICD() {
  const { needCICD } = await inquirer.prompt([
    {
      type: "confirm",
      name: "needCICD",
      message: "Do you want to set up CI/CD workflow?",
      default: false,
    },
  ]);

  let cicdTemplates = null;
  if (needCICD) {
    const { cicdChoices } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "cicdChoices",
        message: "Choose a CI/CD template:",
        choices: [
          "reactjs-cloudfront-deploy",
          "nextjs-cloudfront-deploy",
          "express-ec2-server-deploy",
        ],
      },
    ]);
    cicdTemplates = cicdChoices;
  }

  return {needCICD, cicdTemplates};
}
