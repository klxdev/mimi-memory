import { Command } from "commander";
import { loadConfig, getDataDir } from "../config";
import { PipelineEngine, Repository, setDataDir } from "@ai-dev-labs/mimi-sdk";
import { logger } from "../lib/logger";

export const pipelineCommand = new Command("pipeline")
  .description("Internal command to run the extraction pipeline on a memory")
  .argument("<id>", "Memory ID to process")
  .action(async (id) => {
    logger.log(
      `[${new Date().toISOString()}] Starting pipeline for memory ${id}`,
    );
    try {
      const config = await loadConfig();
      setDataDir(getDataDir());
      const repo = new Repository();
      const memory = await repo.getById(id);

      if (!memory) {
        console.error(`Memory with ID ${id} not found.`);
        process.exit(1);
      }

      logger.log(
        `[${new Date().toISOString()}] Memory loaded: ${memory.content.slice(0, 50)}...`,
      );

      const engine = new PipelineEngine(config);

      // 1. Extract Entities
      logger.log(`[${new Date().toISOString()}] Extracting entities...`);
      const entities = await engine.extractEntities(memory);
      logger.log(
        `[${new Date().toISOString()}] Extracted ${entities.length} entities.`,
      );

      // 2. Run Pipeline Steps
      logger.log(
        `[${new Date().toISOString()}] Running additional pipeline steps...`,
      );
      const additionalMemories = await engine.runPipelineSteps(memory);
      logger.log(
        `[${new Date().toISOString()}] Generated ${additionalMemories.length} additional memories.`,
      );

      // 3. Save everything
      logger.log(`[${new Date().toISOString()}] Saving to repository...`);
      await repo.saveBatch(additionalMemories, entities);

      // 4. Update the original memory with entity IDs
      if (entities.length > 0) {
        logger.log(
          `[${new Date().toISOString()}] Updating original memory with entity IDs...`,
        );
        const entityIds = entities.map((e) => e.id);
        try {
          await repo.updateMemory(id, { entityIds });
          logger.log(`[${new Date().toISOString()}] Update successful.`);
        } catch (updateError: any) {
          console.error(
            `[${new Date().toISOString()}] Failed to update memory with entity IDs: ${updateError.message}`,
          );
          // We don't exit here because the other memories were saved
        }
      }

      logger.log(
        `[${new Date().toISOString()}] Pipeline completed for memory ${id}`,
      );
    } catch (error: any) {
      console.error(
        `[${new Date().toISOString()}] Pipeline processing failed:`,
        error.message,
      );
      process.exit(1);
    }
  });
