import { Command } from "commander";
import chalk from "chalk";
import { Repository, setDataDir } from "@ai-dev-labs/mimi-sdk";
import { getDataDir } from "../config";

export const deleteCommand = new Command("delete")
  .description("Delete memory by ID")
  .argument("<id>", "Memory ID")
  .action(async (id) => {
    try {
      setDataDir(getDataDir());
      const repo = new Repository();
      await repo.deleteById(id);
      console.log(chalk.green(`Deleted memory ${id}`));
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });
