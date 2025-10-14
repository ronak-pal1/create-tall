import inquirer from "inquirer";

export const cicdTemplates = [
  {
    name: "React.js + TypeScript",
    value: "reactjs-cloudfront-deploy",
    tags: ["typescript", "react", "cloudfront"],
  },
  {
    name: "Next.js + TypeScript",
    value: "nextjs-cloudfront-deploy",
    tags: ["typescript", "nextjs", "cloudfront"],
  },
  {
    name: "Express.js + TypeScript",
    value: "express-ec2-server-deploy",
    tags: ["typescript", "express", "ec2"],
  },
];

export async function promptCICD(cmdCICD, frontendTags, backendTags) {

  const { needCICD } = cmdCICD ? { needCICD: cmdCICD } : await inquirer.prompt([
    {
      type: "confirm",
      name: "needCICD",
      message: "Do you want to set up GitHub Actions?",
      default: false,
    },
  ]);

  if (!needCICD) {
    return { needCICD, cicdTemplates: [] };
  }

  const { frontendDeploy } = await inquirer.prompt([
    {
      type: "list",
      name: "frontendDeploy",
      message: "Choose where to deploy your frontend app:",
      choices: ["AWS CloudFront", "AWS EC2", "None"],
      default: "None",
    },
  ]);

  const { backendDeploy } = await inquirer.prompt([
    {
      type: "list",
      name: "backendDeploy",
      message: "Choose where to deploy your backend app:",
      choices: ["AWS EC2", "None"],
      default: "None",
    },
  ]);

  let cicdTemplates = [];
  if (frontendDeploy === "AWS CloudFront") {
    if (frontendTags.includes("react")) {
      cicdTemplates.push("reactjs-cloudfront-deploy");
    }
    if (frontendTags.includes("nextjs")) {
      cicdTemplates.push("nextjs-cloudfront-deploy");
    }
  }
  if (frontendDeploy === "AWS EC2") {
    if (backendTags.includes("express")) {
      cicdTemplates.push("express-ec2-server-deploy");
    }
  }

  if (backendDeploy === "AWS EC2") {
    if (backendTags.includes("express")) {
      cicdTemplates.push("express-ec2-server-deploy");
    }
  }

  return { needCICD, cicdTemplates };
}
