export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

class Logger {
  private level: LogLevel = "silent";
  private logDir?: string;

  setLevel(level: LogLevel) {
    this.level = level;
  }

  setLogDir(dir: string) {
    this.logDir = dir;
  }

  debug(...args: any[]) {
    if (this.level === "debug") {
      console.debug(...args);
    }
  }

  info(...args: any[]) {
    if (this.level === "debug" || this.level === "info") {
      console.log(...args);
    }
  }

  warn(...args: any[]) {
    if (this.level !== "silent" && this.level !== "error") {
      console.warn(...args);
    }
  }

  error(...args: any[]) {
    if (this.level !== "silent") {
      console.error(...args);
    }
  }
}

export const sdkLogger = new Logger();
