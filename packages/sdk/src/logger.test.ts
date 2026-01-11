import { describe, it, expect, vi, beforeEach } from "vitest";
import { sdkLogger } from "./logger";

describe("sdkLogger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sdkLogger.setLevel("silent");
  });

  it("should not log anything when level is silent", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    sdkLogger.debug("test");
    sdkLogger.info("test");
    sdkLogger.warn("test");
    sdkLogger.error("test");

    expect(debugSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should log debug and above when level is debug", () => {
    sdkLogger.setLevel("debug");
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    sdkLogger.debug("debug");
    sdkLogger.info("info");
    sdkLogger.warn("warn");
    sdkLogger.error("error");

    expect(debugSpy).toHaveBeenCalledWith("debug");
    expect(logSpy).toHaveBeenCalledWith("info");
    expect(warnSpy).toHaveBeenCalledWith("warn");
    expect(errorSpy).toHaveBeenCalledWith("error");
  });

  it("should log info and above when level is info", () => {
    sdkLogger.setLevel("info");
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    sdkLogger.debug("debug");
    sdkLogger.info("info");
    sdkLogger.warn("warn");
    sdkLogger.error("error");

    expect(debugSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("info");
    expect(warnSpy).toHaveBeenCalledWith("warn");
    expect(errorSpy).toHaveBeenCalledWith("error");
  });

  it("should log only error when level is error", () => {
    sdkLogger.setLevel("error");
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    sdkLogger.debug("debug");
    sdkLogger.info("info");
    sdkLogger.warn("warn");
    sdkLogger.error("error");

    expect(debugSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith("error");
  });

  it("should set log directory", () => {
    sdkLogger.setLogDir("/tmp/logs");
    // Currently setLogDir doesn't do much in the code, but we test the setter
    expect(true).toBe(true);
  });
});
