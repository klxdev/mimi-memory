#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { queryCommand } from "./commands/query";
import { listCommand } from "./commands/list";
import { getCommand } from "./commands/get";
import { deleteCommand } from "./commands/delete";
import { instructionCommand } from "./commands/instruction";
import { verifyCommand } from "./commands/verify";
import { pipelineCommand } from "./commands/pipeline";
import { logger } from "./lib/logger";
import { sdkLogger } from "@ai-dev-labs/mimi-sdk";
import { loadConfig } from "./config";
import { getLogsDir } from "./lib/utils/paths";

const program = new Command();

program
  .name("mimi")
  .description("AI Memory CLI")
  .version("0.1.0")
  .option("--debug", "Enable debug logging", false)
  .hook("preAction", async () => {
    const opts = program.opts();
    let debug = opts.debug;
    let logsDir = getLogsDir();

    try {
      const config = await loadConfig();
      if (!debug && config.debug) {
        debug = true;
      }
      if (config.logsDir) {
        logsDir = config.logsDir;
      }
    } catch {
      // Ignore config load errors for debug/logsDir setting
    }

    if (debug) {
      logger.setDebug(true);
      sdkLogger.setLevel("debug");
    } else {
      sdkLogger.setLevel("silent");
    }
    sdkLogger.setLogDir(logsDir);
  });

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(queryCommand);
program.addCommand(listCommand);
program.addCommand(getCommand);
program.addCommand(deleteCommand);
program.addCommand(instructionCommand);
program.addCommand(verifyCommand);
program.addCommand(pipelineCommand);

program.parse(process.argv);
