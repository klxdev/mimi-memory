import { describe, it, expect, vi, beforeEach } from "vitest";
import { setDataDir, getDb } from "./db";
import fs from "fs-extra";
import * as lancedb from "@lancedb/lancedb";

vi.mock("fs-extra", () => ({
  default: {
    ensureDir: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@lancedb/lancedb", () => ({
  connect: vi
    .fn()
    .mockResolvedValue({ tableNames: vi.fn().mockResolvedValue([]) }),
}));

describe("db utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset internal state if possible, or just be aware of it
    setDataDir("");
  });

  it("should throw error if data dir is not set", async () => {
    await expect(getDb()).rejects.toThrow("Data directory not set");
  });

  it("should connect to lancedb when data dir is set", async () => {
    setDataDir("/tmp/mimi-data");
    const db = await getDb();
    expect(db).toBeDefined();
    expect(fs.ensureDir).toHaveBeenCalledWith("/tmp/mimi-data");
    expect(lancedb.connect).toHaveBeenCalledWith("/tmp/mimi-data");
  });

  it("should reuse db instance for same dir", async () => {
    setDataDir("/tmp/mimi-data");
    await getDb();
    await getDb();
    // In our mock, connect is called only once because of the singleton pattern in db.ts
    expect(lancedb.connect).toHaveBeenCalledTimes(1);
  });
});
