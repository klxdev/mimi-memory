import { describe, it, expect, vi } from "vitest";
import { LocalProvider } from "./local";

// Mock transformers to avoid loading real models
vi.mock("@xenova/transformers", () => ({
  pipeline: vi.fn().mockResolvedValue(() => ({
    data: [0.1, 0.2, 0.3],
  })),
}));

describe("LocalProvider", () => {
  it("should generate a placeholder response", async () => {
    const provider = new LocalProvider();
    const response = await provider.generate({ prompt: "Hello" });
    expect(response.text).toContain("LocalProvider Warning");
  });

  it("should generate a JSON response for entity extraction prompts", async () => {
    const provider = new LocalProvider();
    const response = await provider.generate({
      prompt: "Identify the key entities",
    });
    expect(response.text).toContain("LocalEntity");
  });

  it("should generate embeddings using the mock pipeline", async () => {
    const provider = new LocalProvider();
    const vector = await provider.embed("test");
    expect(vector).toEqual([0.1, 0.2, 0.3]);
  });
});
