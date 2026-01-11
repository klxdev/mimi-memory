import { describe, it, expect, vi, beforeEach } from "vitest";
import { listAction } from "./list";
import { Repository } from "@ai-dev-labs/mimi-sdk";

vi.mock("@ai-dev-labs/mimi-sdk", () => {
  const mockRepo = {
    getAll: vi.fn(),
  };
  return {
    Repository: vi.fn(() => mockRepo),
    setDataDir: vi.fn(),
  };
});

vi.mock("../config", () => ({
  getDataDir: vi.fn().mockReturnValue("/tmp/mimi-data"),
}));

describe("listAction", () => {
  let repoInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    repoInstance = new Repository();
  });

  it("should call repo.getAll with provided limit", async () => {
    repoInstance.getAll.mockResolvedValue([]);
    await listAction({ limit: "5" });
    expect(repoInstance.getAll).toHaveBeenCalledWith(5);
  });
});
