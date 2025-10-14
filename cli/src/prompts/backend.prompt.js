import select from "@inquirer/select";

export const backendTemplates = [
  {
    name: "Express.js + TypeScript",
    value: "express-app",
    tags: ["typescript", "express"],
    description: "Express.js framework with TypeScript, Role based JWT auth and MongoDB support.",
  },
  {
    name: "Nest.js + TypeScript",
    value: "nest-app",
    tags: ["typescript", "nest"],
    description: "Nest.js framework with TypeScript support.",
  },
  {
    name: "Fastify",
    value: "fastify-app",
    tags: ["fastify"],
    description: "Fastify framework with TypeScript support.",
  },
  {
    name: "Go",
    value: "go-app",
    tags: ["go"],
    description: "Go framework with TypeScript support.",
  },
];

export async function promptBackend() {
  const choices = [...backendTemplates.map((template) => ({
    name: template.name,
    value: template.value,
    description: template.description,
  })), {
    name: "None",
    value: null,
    description: "No backend template.",
  }];

  const backend = await select({
    message: 'Choose your backend template:',
    choices,
  });

  return backend;
}
