import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "./logger";

describe("CLI Logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    logger.setDebug(false);
  });

  it("should not log debug/info/warn when debug is false", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    logger.log("test");
    logger.info("test");
    logger.warn("test");

    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should log success even when debug is false", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.success("success message");
    expect(logSpy).toHaveBeenCalledWith("success message");
  });

  it("should log error even when debug is false", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("error message");
    expect(errorSpy).toHaveBeenCalledWith("error message");
  });

  it("should log everything when debug is true", () => {
    logger.setDebug(true);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    logger.log("debug log");
    logger.info("info log");
    logger.warn("warn log");

    expect(logSpy).toHaveBeenCalledWith("debug log");
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("INFO:"),
      "info log",
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("WARN:"),
      "warn log",
    );
  });

  it("should return a mocked spinner when debug is false", () => {
    const spinner = logger.spinner("test");
    expect(spinner.start()).toBeDefined();
    expect(spinner.stop()).toBeDefined();
    // It should be a mock, but since we return an object with specific functions, we check those
  });
});
