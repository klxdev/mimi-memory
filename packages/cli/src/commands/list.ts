import { Command } from "commander";
import chalk from "chalk";
import { Repository, setDataDir } from "@ai-dev-labs/mimi-sdk";
import { getDataDir } from "../config";

export const listCommand = new Command("list")
  .description("List recent memories")
  .option("-n, --limit <number>", "Number of memories to show", "20")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    try {
      setDataDir(getDataDir());
      const repo = new Repository();
      const memories = await repo.getAll(parseInt(options.limit));

      if (options.json) {
        // Parse metadata string back to object
        const output = memories.map((m: any) => ({
          ...m,
          metadata:
            typeof m.metadata === "string"
              ? JSON.parse(m.metadata)
              : m.metadata,
        }));
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(chalk.bold(`Last ${memories.length} memories:`));
        memories.forEach((m: any) => {
          console.log(chalk.dim(`- [${m.type}] ${m.id}`));
          console.log(`  ${m.content.slice(0, 80).replace(/\n/g, " ")}...`);
        });
      }
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });
