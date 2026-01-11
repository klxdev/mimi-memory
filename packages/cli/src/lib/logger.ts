import chalk from "chalk";
import ora, { Ora } from "ora";

class Logger {
  private isDebug: boolean = false;

  setDebug(value: boolean) {
    this.isDebug = value;
  }

  getDebug(): boolean {
    return this.isDebug;
  }

  log(...args: any[]) {
    if (this.isDebug) {
      console.log(...args);
    }
  }

  error(...args: any[]) {
    console.error(...args);
  }

  info(...args: any[]) {
    if (this.isDebug) {
      console.log(chalk.blue("INFO:"), ...args);
    }
  }

  warn(...args: any[]) {
    if (this.isDebug) {
      console.warn(chalk.yellow("WARN:"), ...args);
    }
  }

  // For command results that SHOULD always be shown
  success(...args: any[]) {
    console.log(...args);
  }

  spinner(text: string): Ora {
    const s = ora(text);
    if (!this.isDebug) {
      // Mock spinner if not debug
      return {
        start: () => s,
        stop: () => s,
        succeed: () => s,
        fail: () => s,
        text: "",
      } as any;
    }
    return s;
  }
}

export const logger = new Logger();
