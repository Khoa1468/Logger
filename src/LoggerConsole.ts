import { LoggerMethod } from "./LoggerMethod.js";
import { IOReturnType, IOErrorParam } from "./LoggerInterfaces.js";
import chalk from "chalk";

export class LoggerConsole extends LoggerMethod {
  public log(...message: unknown[]): IOReturnType {
    return this.handleLog("log", message, "Log");
  }
  public warn(...message: unknown[]): IOReturnType {
    return this.handleLog("warn", message, "Warn", (chalk.Color = "yellow"));
  }
  public error(...message: unknown[]): IOReturnType {
    return this.handleLog("error", message, "Error", (chalk.Color = "red"));
  }
  public info(...message: unknown[]): IOReturnType {
    return this.handleLog("info", message, "Info", (chalk.Color = "cyan"));
  }
  public fatal<T extends object>(error: IOErrorParam<T>): IOReturnType {
    return this.handleLogFatal<T>(error);
  }
}
