import { Command } from "commander";
import chalk from "chalk";
import { Repository, setDataDir } from "@ai-dev-labs/mimi-sdk";
import { getDataDir } from "../config";
import { logger } from "../lib/logger";

export const getAction = async (id: string, options: any) => {
  try {
    setDataDir(getDataDir());
    const repo = new Repository();
    const memory = await repo.getById(id);

    if (!memory) {
      logger.error(chalk.red(`Memory not found: ${id}`));
      process.exit(1);
    }

    if (options.json) {
      memory.metadata =
        typeof memory.metadata === "string"
          ? JSON.parse(memory.metadata)
          : memory.metadata;
      logger.success(JSON.stringify(memory, null, 2));
    } else {
      logger.success(chalk.bold(`Memory: ${memory.id}`));
      logger.success(
        chalk.dim(
          `Type: ${memory.type} | Created: ${new Date(memory.created_at).toLocaleString()}`,
        ),
      );
      logger.success(`
${memory.content}`);
      logger.success(
        chalk.dim(`
Metadata: ${memory.metadata}`),
      );
    }
  } catch (error: any) {
    logger.error(chalk.red(error.message));
  }
};

export const getCommand = new Command("get")
  .description("Get memory by ID")
  .argument("<id>", "Memory ID")
  .option("--json", "Output as JSON")
  .action(getAction);
