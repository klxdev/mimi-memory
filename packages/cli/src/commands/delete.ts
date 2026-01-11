import { Command } from "commander";
import chalk from "chalk";
import { Repository, setDataDir } from "@ai-dev-labs/mimi-sdk";
import { getDataDir } from "../config";
import { logger } from "../lib/logger";

export const deleteAction = async (id: string) => {
  try {
    setDataDir(getDataDir());
    const repo = new Repository();
    await repo.deleteById(id);
    logger.log(chalk.green(`Deleted memory ${id}`));
  } catch (error: any) {
    logger.error(chalk.red(error.message));
  }
};

export const deleteCommand = new Command("delete")
  .description("Delete memory by ID")
  .argument("<id>", "Memory ID")
  .action(deleteAction);
