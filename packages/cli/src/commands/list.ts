import { Command } from "commander";
import chalk from "chalk";
import { Repository, setDataDir } from "@ai-dev-labs/mimi-sdk";
import { getDataDir } from "../config";
import { logger } from "../lib/logger";

export const listAction = async (options: any) => {
  try {
    setDataDir(getDataDir());
    const repo = new Repository();
    const memories = await repo.getAll(parseInt(options.limit));

    if (options.json) {
      // Parse metadata string back to object
      const output = memories.map((m: any) => ({
        ...m,
        metadata:
          typeof m.metadata === "string" ? JSON.parse(m.metadata) : m.metadata,
      }));
      logger.success(JSON.stringify(output, null, 2));
    } else {
      logger.success(chalk.bold(`Last ${memories.length} memories:`));
      memories.forEach((m: any) => {
        logger.success(chalk.dim(`- [${m.type}] ${m.id}`));
        logger.success(`  ${m.content.slice(0, 80).replace(/\n/g, " ")}...`);
      });
    }
  } catch (error: any) {
    logger.error(chalk.red(error.message));
  }
};

export const listCommand = new Command("list")
  .description("List recent memories")
  .option("-n, --limit <number>", "Number of memories to show", "20")
  .option("--json", "Output as JSON")
  .action(listAction);
