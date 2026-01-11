import { describe, it, expect, vi } from "vitest";
import { LLMFactory } from "./factory";
import { GoogleProvider } from "./providers/google";
import { LocalProvider } from "./providers/local";
import { MockProvider } from "./providers/mock";

describe("LLMFactory", () => {
  const config: any = {
    providers: {
      myGoogle: {
        type: "google",
        apiKey: "test-key",
        model: "gemini-pro",
      },
      myLocal: {
        type: "local",
      },
      myMock: {
        type: "mock",
      },
    },
    pipeline: {},
  };

  it("should create GoogleProvider", () => {
    const factory = new LLMFactory(config);
    const provider = factory.getProvider("myGoogle");
    expect(provider).toBeInstanceOf(GoogleProvider);
  });

  it("should create LocalProvider", () => {
    const factory = new LLMFactory(config);
    const provider = factory.getProvider("myLocal");
    expect(provider).toBeInstanceOf(LocalProvider);
  });

  it("should create MockProvider for explicit mock type", () => {
    const factory = new LLMFactory(config);
    const provider = factory.getProvider("myMock");
    expect(provider).toBeInstanceOf(MockProvider);
  });

  it("should create MockProvider for unknown provider name", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const factory = new LLMFactory(config);
    const provider = factory.getProvider("unknown");
    expect(provider).toBeInstanceOf(MockProvider);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("should throw error for Google provider without API key", () => {
    const invalidConfig: any = {
      providers: {
        badGoogle: {
          type: "google",
          model: "gemini-pro",
        },
      },
      pipeline: {},
    };
    const factory = new LLMFactory(invalidConfig);
    expect(() => factory.getProvider("badGoogle")).toThrow(/API Key required/);
  });

  it("should return cached provider", () => {
    const factory = new LLMFactory(config);
    const provider1 = factory.getProvider("myLocal");
    const provider2 = factory.getProvider("myLocal");
    expect(provider1).toBe(provider2);
  });
});
