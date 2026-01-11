import { describe, it, expect, vi } from "vitest";
import { instructionAction } from "./instruction";
import { logger } from "../lib/logger";

describe("instructionAction", () => {
  it("should output instructions via logger.success", () => {
    const successSpy = vi.spyOn(logger, "success").mockImplementation(() => {});
    instructionAction();
    expect(successSpy).toHaveBeenCalledWith(
      expect.stringContaining("Required Agent Memory Protocol"),
    );
  });
});
