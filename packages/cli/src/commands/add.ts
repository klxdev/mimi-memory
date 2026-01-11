import { Command } from "commander";
import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import { spawn } from "child_process";
import { loadConfig, getDataDir } from "../config";
import { getProjectMetadata, getLogsDir } from "../lib/utils/paths";
import { PipelineEngine, Repository, setDataDir } from "@ai-dev-labs/mimi-sdk";
import { logger } from "../lib/logger";

export const addAction = async (text: string | undefined, options: any) => {
  const spinner = logger.spinner("Initializing...").start();

  try {
    // 1. Load Config

    const config = await loadConfig();

    setDataDir(getDataDir());

    // 2. Resolve Input

    let inputContent = text || "";

    if (options.file) {
      if (await fs.pathExists(options.file)) {
        inputContent = await fs.readFile(options.file, "utf-8");
      } else {
        throw new Error(`File not found: ${options.file}`);
      }
    }

    if (!inputContent) {
      throw new Error("No content provided. Use arguments or --file.");
    }

    // 3. Prepare Metadata

    const projectMeta = getProjectMetadata();

    const metadata: any = {};

    if (options.project || projectMeta.project) {
      metadata.project = options.project || projectMeta.project;
    }

    if (options.userid) metadata.userId = options.userid;

    const engine = new PipelineEngine(config);

    const repo = new Repository();

    if (options.sync) {
      spinner.text = "Processing memory pipeline (sync)...";

      const result = await engine.process(inputContent, metadata);

      spinner.text = "Saving to storage...";

      await repo.saveBatch(result.memories, result.entities);

      spinner.succeed(chalk.green("Memory added and processed successfully!"));

      logger.log(
        chalk.dim(
          `Created ${result.memories.length} memory entries and ${result.entities.length} entities.`,
        ),
      );
    } else {
      spinner.text = "Saving raw memory...";

      // 4. Create and Save Raw Memory only

      const rawMemory = await engine.createRawMemory(inputContent, metadata);

      await repo.saveBatch([rawMemory], []);

      spinner.text = "Triggering background pipeline...";

      // 5. Spawn background process

      const logFile = path.join(getLogsDir(), "pipeline.log");

      await fs.ensureDir(path.dirname(logFile));

      const out = fs.openSync(logFile, "a");

      const err = fs.openSync(logFile, "a");

      const args = [process.argv[1], "pipeline", rawMemory.id];

      if (logger.getDebug()) {
        args.push("--debug");
      }

      const child = spawn(process.argv[0], args, {
        detached: true,

        stdio: ["ignore", out, err],
      });

      child.unref();

      spinner.succeed(chalk.green("Memory accepted!"));

      logger.log(chalk.dim("Processing continues in the background."));
    }
  } catch (error: any) {
    spinner.fail(chalk.red("Failed to add memory"));

    logger.error(chalk.red(error.message));

    process.exit(1);
  }
};

export const addCommand = new Command("add")

  .description("Add a new memory")

  .argument("[text]", "Raw text content to add (optional if --file is used)")

  .option("-f, --file <path>", "Path to a text file")

  .option("-p, --project <project>", "Project identifier")

  .option("-u, --userid <userid>", "User identifier")

  .option("--sync", "Run processing synchronously")

  .action(addAction);
