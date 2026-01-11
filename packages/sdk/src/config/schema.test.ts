import { describe, it, expect } from "vitest";
import { ConfigSchema } from "./schema";

describe("ConfigSchema", () => {
  it("should validate a valid config", () => {
    const validConfig = {
      providers: {
        openai: {
          model: "gpt-4",
          apiKey: "test-key",
        },
      },
      pipeline: {
        extract: {
          provider: "openai",
          prompt: "extract entities",
        },
      },
      debug: true,
      logsDir: "/tmp/logs",
    };

    const result = ConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("should fail validation if providers is missing", () => {
    const invalidConfig = {
      pipeline: {},
    };

    const result = ConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should allow extra fields in provider config", () => {
    const configWithExtra = {
      providers: {
        custom: {
          model: "custom-model",
          extraParam: "extraValue",
        },
      },
      pipeline: {},
    };

    const result = ConfigSchema.safeParse(configWithExtra);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.providers.custom.extraParam).toBe("extraValue");
    }
  });
});
