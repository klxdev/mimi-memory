import { describe, it, expect } from "vitest";
import {
  getMimiDir,
  getConfigPath,
  getDataDir,
  getLogsDir,
  findProjectConfig,
} from "./paths";
import path from "path";
import os from "os";

describe("paths utility", () => {
  it("should return correct mimi dir", () => {
    expect(getMimiDir()).toBe(path.join(os.homedir(), ".mimi"));
  });

  it("should return correct config path", () => {
    expect(getConfigPath()).toBe(
      path.join(os.homedir(), ".mimi", "settings.json"),
    );
  });

  it("should return correct data dir", () => {
    expect(getDataDir()).toBe(path.join(os.homedir(), ".mimi", "data"));
  });

  it("should return correct logs dir", () => {
    expect(getLogsDir()).toBe(path.join(os.homedir(), ".mimi", "logs"));
  });

  it("should find project config", () => {
    // This depends on the actual environment, but we can mock fs if needed.
    // In this repo, there is a mimi.toml in the root.
    const rootConfig = findProjectConfig(process.cwd());
    expect(rootConfig).toContain("mimi.toml");
  });
});
