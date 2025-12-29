import * as lancedb from "@lancedb/lancedb";
import fs from "fs-extra";

let dbInstance: lancedb.Connection | null = null;
let currentDataDir: string | null = null;

export function setDataDir(dir: string) {
  if (currentDataDir !== dir) {
    currentDataDir = dir;
    dbInstance = null;
  }
}

export async function getDb(dataDir?: string): Promise<lancedb.Connection> {
  const finalDir = dataDir || currentDataDir;
  if (!finalDir) {
    throw new Error(
      "Data directory not set. Call setDataDir() or pass a path to getDb().",
    );
  }

  if (dbInstance && currentDataDir === finalDir) return dbInstance;

  await fs.ensureDir(finalDir);
  dbInstance = await lancedb.connect(finalDir);
  currentDataDir = finalDir;
  return dbInstance;
}

export async function ensureTables() {
  const db = await getDb();
  const tableNames = await db.tableNames();
  return tableNames;
}
