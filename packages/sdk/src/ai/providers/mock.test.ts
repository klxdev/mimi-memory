import { describe, it, expect } from "vitest";
import { MockProvider } from "./mock";

describe("MockProvider", () => {
  it("should generate a mock response", async () => {
    const provider = new MockProvider();
    const response = await provider.generate({ prompt: "Hello" });
    expect(response.text).toContain("mock response");
  });

  it("should generate a JSON response for JSON prompts", async () => {
    const provider = new MockProvider();
    const response = await provider.generate({ prompt: "give me json" });
    expect(response.text).toContain("TestEntity");
    expect(JSON.parse(response.text)).toBeDefined();
  });

  it("should generate random embeddings", async () => {
    const provider = new MockProvider();
    const vector = await provider.embed("test");
    expect(vector.length).toBe(1536);
    expect(vector[0]).toBeLessThan(1);
  });
});
