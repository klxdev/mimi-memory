import { describe, it, expect, vi, beforeEach } from "vitest";
import { addAction } from "./add";
import { PipelineEngine, Repository } from "@ai-dev-labs/mimi-sdk";

vi.mock("@ai-dev-labs/mimi-sdk", () => {
  const mockEngine = {
    process: vi.fn().mockResolvedValue({ memories: [], entities: [] }),
    createRawMemory: vi.fn().mockResolvedValue({ id: "raw-id" }),
  };
  const mockRepo = {
    saveBatch: vi.fn().mockResolvedValue(undefined),
  };
  return {
    PipelineEngine: vi.fn(() => mockEngine),
    Repository: vi.fn(() => mockRepo),
    setDataDir: vi.fn(),
  };
});

vi.mock("../config", () => ({
  loadConfig: vi.fn().mockResolvedValue({ providers: {}, pipeline: {} }),
  getDataDir: vi.fn().mockReturnValue("/tmp/mimi-data"),
}));

vi.mock("fs-extra", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs-extra")>();
  return {
    ...actual,
    pathExists: vi.fn().mockResolvedValue(true),
    readFile: vi.fn().mockResolvedValue("file content"),
    ensureDir: vi.fn().mockResolvedValue(undefined),
    openSync: vi.fn().mockReturnValue(1),
  };
});

vi.mock("child_process", () => ({
  spawn: vi.fn().mockReturnValue({ unref: vi.fn() }),
}));

describe("addAction", () => {
  let engineInstance: any;
  let repoInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    engineInstance = new PipelineEngine({} as any);
    repoInstance = new Repository();
  });

  it("should process memory synchronously when sync option is true", async () => {
    await addAction("some text", { sync: true });
    expect(engineInstance.process).toHaveBeenCalled();
    expect(repoInstance.saveBatch).toHaveBeenCalled();
  });

  it("should save raw memory and spawn background process when sync is false", async () => {
    await addAction("some text", { sync: false });
    expect(engineInstance.createRawMemory).toHaveBeenCalled();
    expect(repoInstance.saveBatch).toHaveBeenCalled();
  });
});
