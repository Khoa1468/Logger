import { LoggerMethod } from "./LoggerMethod.js";
import { ReturnType } from "./LoggerReturnType.js";

export class LoggerConsole extends LoggerMethod {
  public log(...message: unknown[]): ReturnType {
    const timeAndType = this.getTimeAndType("Log");
    console.log(`${message ? `${timeAndType.ToString}` : ""}`, ...message);
    return this.returnTypeFunction("log", timeAndType, message, {
      name: this.name,
      isDisplayRootFile: this.isDisplayRootFile,
      isLoggedAt: this.isLoggedAt,
      isType: this.isType,
    });
  }
  public warn(...message: unknown[]): ReturnType {
    const timeAndType = this.getTimeAndType("Warn");
    console.warn(`${message ? `${timeAndType.ToString}` : ""}`, ...message);
    return this.returnTypeFunction("warn", timeAndType, message, {
      name: this.name,
      isDisplayRootFile: this.isDisplayRootFile,
      isLoggedAt: this.isLoggedAt,
      isType: this.isType,
    });
  }
  public error(...message: unknown[]): ReturnType {
    const timeAndType = this.getTimeAndType("Error");
    console.error(`${message ? `${timeAndType.ToString}` : ""}`, ...message);
    return this.returnTypeFunction("error", timeAndType, message, {
      name: this.name,
      isDisplayRootFile: this.isDisplayRootFile,
      isLoggedAt: this.isLoggedAt,
      isType: this.isType,
    });
  }
  public info(...message: unknown[]): ReturnType {
    const timeAndType = this.getTimeAndType("Info");
    console.info(`${message ? `${timeAndType.ToString}` : ""}`, ...message);
    return this.returnTypeFunction("info", timeAndType, message, {
      name: this.name,
      isDisplayRootFile: this.isDisplayRootFile,
      isLoggedAt: this.isLoggedAt,
      isType: this.isType,
    });
  }
}
