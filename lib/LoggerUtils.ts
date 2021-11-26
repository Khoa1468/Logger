import chalk from "chalk";
import {
  IOAllLogObj,
  IOErrorStack,
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOReturnType,
  IOSetting,
} from "./LoggerInterfaces.js";
import { LoggerProperty } from "./LoggerProperty.js";
import { get as callsites, StackFrame } from "./stacktrace";
import { Logger as LoggerClass } from "./Logger.js";

export class LoggerUtils extends LoggerProperty {
  protected cleanPath(path: string | null): string {
    if (path === null) return "";
    return path.replace(/file:\/\/\//, "").replace(/%20/g, " ");
  }
  public getTimeAndType(
    type: "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
    color: string = (chalk.Color = "white"),
    loggedAt: string
  ): IOReturnGetTimeAndType {
    const filePath: string = this.cleanPath(callsites()[3].getFileName());
    const fullFilePath: string | null = callsites()[3].getFileName();
    const lineNumber: number | null = callsites()[3].getLineNumber();
    const lineColumm: number | null = callsites()[3].getColumnNumber();
    return {
      ToString: `${
        this.isType || this.isLoggedAt || this.isDisplayRootFile
          ? `[${this.isType ? `Type: ${chalk.keyword(color)(type)}` : ""}${
              this.isLoggedAt
                ? `${this.isType ? `, ` : ""}Time: ${loggedAt}${
                    this.isDisplayRootFile ? "," : ""
                  }`
                : ""
            }${this.isLoggedAt && this.isDisplayRootFile ? " " : ""}${
              this.isDisplayRootFile && this.isType && !this.isLoggedAt
                ? ", "
                : ""
            }${
              this.isDisplayRootFile
                ? `File: "${filePath}:${lineNumber}:${lineColumm}"`
                : ""
            }] ${chalk.whiteBright(`[${chalk.cyanBright(this.cagetoryName)}]`)}`
          : `${chalk.whiteBright(`[${chalk.cyanBright(this.cagetoryName)}]`)}`
      }`,
      filePath,
      lineNumber,
      lineColumm,
      fullFilePath,
    };
  }
  public getErrorStack(
    stack?: StackFrame[] | undefined,
    range: number = 3
  ): IOErrorStack {
    if (stack) {
      return {
        filePath: this.cleanPath(stack[0].getFileName()),
        fullFilePath: stack[0].getFileName(),
        lineNumber: stack[0].getLineNumber(),
        lineColumm: stack[0].getColumnNumber(),
        methodName: stack[0].getMethodName(),
        functionName: stack[0].getFunctionName(),
        isConstructor: stack[0].isConstructor(),
        typeName: stack[0].getTypeName(),
      };
    } else {
      const localStack = callsites();
      return {
        filePath: this.cleanPath(localStack[range].getFileName()),
        fullFilePath: localStack[range].getFileName(),
        lineNumber: localStack[range].getLineNumber(),
        lineColumm: localStack[range].getColumnNumber(),
        methodName: localStack[range].getMethodName(),
        functionName: localStack[range].getFunctionName(),
        isConstructor: localStack[range].isConstructor(),
        typeName: localStack[range].getTypeName(),
      };
    }
  }
  public setSettings({
    instanceName = this.name,
    isLoggedAt = this.isLoggedAt,
    isType = this.isType,
    isDisplayRootFile = this.isDisplayRootFile,
    cagetoryName = this.cagetoryName,
    format = this.format,
    levelLog = this.levelLog,
  }: IOLoggerInterface): void {
    this.name = instanceName;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
    this.cagetoryName = cagetoryName;
    this.format = format;
    this.levelLog = levelLog;
  }
  public listSetting(): IOSetting {
    return {
      instanceName: this.name,
      isLoggedAt: this.isLoggedAt,
      isType: this.isType,
      isDisplayRootFile: this.isDisplayRootFile,
      cagetoryName: this.cagetoryName,
      hostName: this.hostname,
      format: this.format,
      levelLog: this.levelLog,
    };
  }
  public get loggerName(): string {
    return this.name;
  }
  public set loggerName(newName: string) {
    if (newName.length > 1) {
      this.loggerName = newName;
    } else {
      throw Error("newName error");
    }
  }
  public getAllLogObj(): IOAllLogObj {
    function censor(censor: any) {
      var i = 0;

      return function (key: string, value: any) {
        if (
          i !== 0 &&
          typeof censor === "object" &&
          typeof value == "object" &&
          censor == value
        )
          return "[Circular]";

        ++i;

        return value;
      };
    }
    return {
      total: this.allLogObj.length,
      allLogObj: { data: this.allLogObj },
      toJson: this.toJson(this.allLogObj, censor(this.allLogObj), 2),
    };
  }
  protected getLoggedTime(): string {
    return `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
  }
  public onload(Logger: typeof LoggerClass) {}
  public toJson(
    data: any,
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    spacing?: number | undefined | string
  ): string {
    return JSON.stringify(data, replacer, spacing);
  }
  public toPretty<T extends any[]>(data: string): IOReturnType<T> {
    return JSON.parse(data);
  }
}
