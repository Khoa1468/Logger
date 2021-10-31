import { LoggerMethod } from "./LoggerMethod.js";
import {
  IOReturnType,
  IOErrorParam,
  IOStd,
  IOReturnError,
} from "./LoggerInterfaces.js";
import chalk from "chalk";

export class LoggerConsole extends LoggerMethod {
  public log<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "log",
      message,
      this.getErrorStack(undefined, 2),
      this.listSetting()
    );
    if (this.levelLog.includes(4) || this.levelLog.includes(5)) {
      return this.handleLog("log", message, "Log");
    } else {
      return ioLogObject;
    }
  }
  public warn<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "warn",
      message,
      this.getErrorStack(undefined, 2),
      this.listSetting()
    );
    if (this.levelLog.includes(2) || this.levelLog.includes(5)) {
      return this.handleLog("warn", message, "Warn", (chalk.Color = "yellow"));
    } else {
      return ioLogObject;
    }
  }
  public error<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "error",
      message,
      this.getErrorStack(undefined, 2),
      this.listSetting()
    );
    if (this.levelLog.includes(1) || this.levelLog.includes(5)) {
      return this.handleLog("error", message, "Error", (chalk.Color = "red"));
    } else {
      return ioLogObject;
    }
  }
  public info<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "info",
      message,
      this.getErrorStack(undefined, 2),
      this.listSetting()
    );
    if (this.levelLog.includes(4) || this.levelLog.includes(5)) {
      return this.handleLog("info", message, "Info", (chalk.Color = "cyan"));
    } else {
      return ioLogObject;
    }
  }
  public fatal<T extends object>(
    error: IOErrorParam<T>
  ): IOReturnType<IOReturnError[]> {
    const ioLogDataError: IOReturnError[] = this.getDataError(
      error,
      error.detail
    );
    const ioLogObject: IOReturnType<IOReturnError[]> =
      this.returnFatalTypeFunction(
        this.getErrorStack(undefined, 2),
        ioLogDataError,
        this.listSetting()
      );
    if (this.levelLog.includes(1) || this.levelLog.includes(5)) {
      return this.handleLogFatal<T>(error);
    } else {
      return ioLogObject;
    }
  }
  public debug<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "debug",
      message,
      this.getErrorStack(undefined, 2),
      this.listSetting()
    );
    if (this.levelLog.includes(3) || this.levelLog.includes(5)) {
      return this.handleLog("debug", message, "Debug", (chalk.Color = "green"));
    } else {
      return ioLogObject;
    }
  }
}
