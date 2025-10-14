import select from '@inquirer/select';

export const frontendTemplates = [
  {
    name: "React.js + TypeScript",
    value: "react-app",
    tags: ["typescript", "react"],
    description: "React framework with TypeScript, Tailwind, Auth support.",
  },
  {
    name: "React.js + TypeScript + Redux",
    value: "react-redux-app",
    tags: ["typescript", "react", "redux"],
    description: "React framework with TypeScript, Tailwind, Redux, Auth support.",
  },
  {
    name: "Next.js + TypeScript",
    value: "next-app",
    tags: ["typescript", "nextjs"],
    description: "Next.js framework with TypeScript support.",
  },
  {
    name: "Vue.js + TypeScript",
    value: "vue-app",
    tags: ["typescript", "vue"],
    description: "Vue.js framework with TypeScript support.",
  },
];


export async function promptFrontend() {

  const choices = [...frontendTemplates.map((template) => (
    {
      name: template.name,
      value: template.value,
      description: template.description,
    }
  )), {
    name: "None",
    value: null,
    description: "No frontend template.",
  }];


  const frontend = await select({
    message: 'Choose your frontend template:',
    choices,
  });


  return frontend;
}
