import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteAction } from "./delete";
import { Repository } from "@ai-dev-labs/mimi-sdk";

vi.mock("@ai-dev-labs/mimi-sdk", () => {
  const mockRepo = {
    deleteById: vi.fn(),
  };
  return {
    Repository: vi.fn(() => mockRepo),
    setDataDir: vi.fn(),
  };
});

vi.mock("../config", () => ({
  getDataDir: vi.fn().mockReturnValue("/tmp/mimi-data"),
}));

describe("deleteAction", () => {
  let repoInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    repoInstance = new Repository();
  });

  it("should call repo.deleteById with the provided ID", async () => {
    repoInstance.deleteById.mockResolvedValue(undefined);
    await deleteAction("test-id");
    expect(repoInstance.deleteById).toHaveBeenCalledWith("test-id");
  });
});
