import path from "path";
import os from "os";

export const MIMI_DIR = path.join(os.homedir(), ".mimi");
export const CONFIG_FILE = path.join(MIMI_DIR, "settings.json");
export const DATA_DIR = path.join(MIMI_DIR, "data");

export function getMimiDir(): string {
  return MIMI_DIR;
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function getDataDir(): string {
  return DATA_DIR;
}
