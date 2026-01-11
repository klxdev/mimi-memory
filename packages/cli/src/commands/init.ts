import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { logger } from "../lib/logger";

function getGitRepoName(): string | null {
  try {
    const gitRoot = execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return path.basename(gitRoot);
  } catch {
    return null;
  }
}

export const initAction = async (options: any) => {
  const spinner = logger.spinner("Initializing mimi project...").start();
  try {
    const configPath = path.join(process.cwd(), "mimi.toml");

    if (await fs.pathExists(configPath)) {
      spinner.fail(chalk.red("mimi.toml already exists in this directory."));
      return;
    }

    const projectName =
      options.name || getGitRepoName() || path.basename(process.cwd());
    const content = `project = "${projectName}"\n`;

    await fs.writeFile(configPath, content);

    spinner.succeed(
      chalk.green(`Initialized mimi project: ${chalk.bold(projectName)}`),
    );
    logger.log(chalk.gray(`Created mimi.toml at ${configPath}`));
  } catch {
    spinner.fail(chalk.red("Failed to initialize mimi project."));
  }
};

export const initCommand = new Command("init")
  .description("Initialize mimi in the current project")
  .option("-n, --name <name>", "Project name")
  .action(initAction);
