import figlet from "figlet";
import chalk from "chalk";

export function printBanner(text) {
  const banner = figlet.textSync(text, {
    font: "ogre",
    horizontalLayout: "full",
    verticalLayout: "default",
    whitespaceBreak: true,
  });

  console.log(chalk.blue(banner));
}
