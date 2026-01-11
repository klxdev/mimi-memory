import { describe, it, expect } from "vitest";
import { PipelineEngine } from "./engine";

describe("PipelineEngine", () => {
  const config: any = {
    providers: {
      default: {
        type: "mock",
        model: "test-model",
      },
    },
    pipeline: {},
  };

  it("should create raw memory with vector", async () => {
    const engine = new PipelineEngine(config);
    const input = "test content";
    const memory = await engine.createRawMemory(input);

    expect(memory.content).toBe(input);
    expect(memory.type).toBe("raw");
    expect(memory.vector).toBeDefined();
    expect(memory.vector?.length).toBeGreaterThan(0);
    expect(memory.id).toBeDefined();
  });

  it("should extract entities from memory", async () => {
    const engine = new PipelineEngine(config);
    const memory: any = {
      content:
        'Identity key entities: [{"name": "Mimi", "type": "Project", "description": "AI memory"}]',
    };

    // We need to ensure the mock provider returns what we expect
    const entities = await engine.extractEntities(memory);
    expect(Array.isArray(entities)).toBe(true);
  });
});
