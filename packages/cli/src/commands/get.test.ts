import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAction } from "./get";
import { Repository } from "@ai-dev-labs/mimi-sdk";

vi.mock("@ai-dev-labs/mimi-sdk", () => {
  const mockRepo = {
    getById: vi.fn(),
  };
  return {
    Repository: vi.fn(() => mockRepo),
    setDataDir: vi.fn(),
  };
});

vi.mock("../config", () => ({
  getDataDir: vi.fn().mockReturnValue("/tmp/mimi-data"),
}));

describe("getAction", () => {
  let repoInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    repoInstance = new Repository();
  });

  it("should call repo.getById with the provided ID", async () => {
    repoInstance.getById.mockResolvedValue({
      id: "exists",
      type: "raw",
      content: "test content",
      metadata: "{}",
      created_at: new Date().toISOString(),
    });

    await getAction("exists", {});
    expect(repoInstance.getById).toHaveBeenCalledWith("exists");
  });

  it("should handle memory not found", async () => {
    repoInstance.getById.mockResolvedValue(null);
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((code?: string | number | null | undefined) => {
        throw new Error("exit " + code);
      });

    try {
      await getAction("not-exists", {});
    } catch (e: any) {
      expect(e.message).toBe("exit 1");
    }

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});
