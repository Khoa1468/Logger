import { LoggerMethod } from "./LoggerMethod.js";
import { IOReturnType, IOErrorParam, IOStd } from "./LoggerInterfaces.js";
import chalk from "chalk";

export class LoggerConsole extends LoggerMethod {
  public log(...message: IOStd[]): IOReturnType {
    return this.handleLog("log", message, "Log");
  }
  public warn(...message: IOStd[]): IOReturnType {
    return this.handleLog("warn", message, "Warn", (chalk.Color = "yellow"));
  }
  public error(...message: IOStd[]): IOReturnType {
    return this.handleLog("error", message, "Error", (chalk.Color = "red"));
  }
  public info(...message: IOStd[]): IOReturnType {
    return this.handleLog("info", message, "Info", (chalk.Color = "cyan"));
  }
  public fatal<T extends object>(error: IOErrorParam<T>): IOReturnType {
    return this.handleLogFatal<T>(error);
  }
  public debug(...message: IOStd[]): IOReturnType {
    return this.handleLog("debug", message, "Debug", (chalk.Color = "green"));
  }
}
