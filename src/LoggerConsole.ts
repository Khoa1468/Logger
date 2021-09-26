import { LoggerMethod } from "./LoggerMethod.js";
import { IOReturnType, IOError, IOErrorParam } from "./LoggerInterfaces.js";

export class LoggerConsole extends LoggerMethod {
  public log(...message: unknown[]): IOReturnType {
    const timeAndType = this.getTimeAndType("Log");
    console.log(`${message ? `${timeAndType.ToString}` : ""}`, ...message);
    return this.returnTypeFunction(
      "log",
      timeAndType,
      message,
      this.listSetting()
    );
  }
  public warn(...message: unknown[]): IOReturnType {
    const timeAndType = this.getTimeAndType("Warn");
    console.warn(`${message ? `${timeAndType.ToString}` : ""}`, ...message);
    return this.returnTypeFunction(
      "warn",
      timeAndType,
      message,
      this.listSetting()
    );
  }
  public error(...message: unknown[]): IOReturnType {
    const timeAndType = this.getTimeAndType("Error");
    console.error(`${message ? `${timeAndType.ToString}` : ""}`, ...message);
    return this.returnTypeFunction(
      "error",
      timeAndType,
      message,
      this.listSetting()
    );
  }
  public info(...message: unknown[]): IOReturnType {
    const timeAndType = this.getTimeAndType("Info");
    console.info(`${message ? `${timeAndType.ToString}` : ""}`, ...message);
    return this.returnTypeFunction(
      "info",
      timeAndType,
      message,
      this.listSetting()
    );
  }
  public fatal<T extends object>(error: IOErrorParam<T>): IOReturnType {
    const timeAndType = this.getTimeAndType("Fatal");
    console.error(
      `${
        error
          ? `${timeAndType.ToString}\n--------------------------------------------------------------------------`
          : ""
      }`
    );
    error.errors.forEach((err: any) => {
      console.error("", "Type Of Error:", err.name, "\n");
      console.error("", "STACK: \n", "");
      console.error("", err.stack, "\n");
      return err;
    });
    console.error(
      `--------------------------------------------------------------------------`
    );

    return this.returnFatalTypeFunction(
      timeAndType,
      error.errors,
      error.detail,
      this.listSetting()
    );
  }
}
