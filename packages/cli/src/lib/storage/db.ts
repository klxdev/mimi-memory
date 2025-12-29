import * as lancedb from "@lancedb/lancedb";
import fs from "fs-extra";
import { getDataDir } from "../utils/paths";

let dbInstance: lancedb.Connection | null = null;

export async function getDb(): Promise<lancedb.Connection> {
  if (dbInstance) return dbInstance;

  const dataDir = getDataDir();
  await fs.ensureDir(dataDir);

  dbInstance = await lancedb.connect(dataDir);
  return dbInstance;
}

export async function ensureTables() {
  const db = await getDb();
  const tableNames = await db.tableNames();

  // We don't create tables here explicitly because LanceDB creates them
  // on the first write with schema, or we can create empty ones.
  // We'll leave creation to the Repository layer when it first tries to write,
  // or explicit creation methods if preferred.
  return tableNames;
}
