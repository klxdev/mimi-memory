import { describe, it, expect, vi, beforeEach } from "vitest";
import { initAction } from "./init";
import fs from "fs-extra";

vi.mock("fs-extra", () => ({
  default: {
    pathExists: vi.fn().mockResolvedValue(false),
    writeFile: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("child_process", () => ({
  execSync: vi.fn().mockReturnValue("test-repo"),
}));

describe("initAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create mimi.toml if it doesn't exist", async () => {
    await initAction({});
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining("mimi.toml"),
      expect.stringContaining('project = "test-repo"'),
    );
  });

  it("should fail if mimi.toml already exists", async () => {
    (fs.pathExists as any).mockResolvedValue(true);
    await initAction({});
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
});
