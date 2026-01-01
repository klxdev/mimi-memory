import fs from "fs-extra";
import { Config, ConfigSchema } from "@ai-dev-labs/mimi-sdk";
import { getConfigPath, getDataDir } from "../lib/utils/paths";

export class ConfigNotFoundError extends Error {
  constructor(path: string) {
    super(
      `Configuration file not found at ${path}. Please create it to use mimi-memory.`,
    );
    this.name = "ConfigNotFoundError";
  }
}

export async function loadConfig(): Promise<Config> {
  const configPath = getConfigPath();
  if (!(await fs.pathExists(configPath))) {
    throw new ConfigNotFoundError(configPath);
  }

  const raw = await fs.readJson(configPath);
  return ConfigSchema.parse(raw);
}

export { getConfigPath, getDataDir };
