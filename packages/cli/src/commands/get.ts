import { Command } from "commander";
import chalk from "chalk";
import { Repository, setDataDir } from "@ai-dev-labs/mimi-sdk";
import { getDataDir } from "../config";

export const getCommand = new Command("get")
  .description("Get memory by ID")
  .argument("<id>", "Memory ID")
  .option("--json", "Output as JSON")
  .action(async (id, options) => {
    try {
      setDataDir(getDataDir());
      const repo = new Repository();
      const memory = await repo.getById(id);

      if (!memory) {
        console.error(chalk.red(`Memory not found: ${id}`));
        process.exit(1);
      }

      if (options.json) {
        memory.metadata =
          typeof memory.metadata === "string"
            ? JSON.parse(memory.metadata)
            : memory.metadata;
        console.log(JSON.stringify(memory, null, 2));
      } else {
        console.log(chalk.bold(`Memory: ${memory.id}`));
        console.log(
          chalk.dim(
            `Type: ${memory.type} | Created: ${new Date(memory.created_at).toLocaleString()}`,
          ),
        );
        console.log(`
${memory.content}`);
        console.log(
          chalk.dim(`
Metadata: ${memory.metadata}`),
        );
      }
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });
