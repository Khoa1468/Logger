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
import { get as callsites, StackFrame } from "stack-trace";

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
    const fullFilePath: string = callsites()[3].getFileName();
    const lineNumber: number = callsites()[3].getLineNumber();
    const lineColumm: number = callsites()[3].getColumnNumber();
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
      let isConstructor: boolean = false;
      if (stack[0].getFunctionName() !== null) {
        if (stack[0].getFunctionName().includes("new ")) {
          isConstructor = true;
        } else {
          isConstructor = false;
        }
      } else {
        isConstructor = false;
      }
      const isClass: boolean =
        (stack[0].getMethodName() !== null &&
          stack[0].getTypeName() !== "Object" &&
          stack[0].getTypeName() !== "Array" &&
          stack[0].getTypeName() !== "String" &&
          stack[0].getTypeName() !== "Number" &&
          stack[0].getTypeName() !== "Boolean") ||
        isConstructor;
      return {
        filePath: this.cleanPath(stack[0].getFileName()),
        fullFilePath: stack[0].getFileName(),
        lineNumber: stack[0].getLineNumber(),
        lineColumm: stack[0].getColumnNumber(),
        methodName: stack[0].getMethodName(),
        functionName: stack[0].getFunctionName(),
        isClass,
        isConstructor: isConstructor,
        typeName: stack[0].getTypeName(),
      };
    } else {
      const localStack = callsites();
      let isConstructor: boolean = false;
      if (localStack[range].getFunctionName() !== null) {
        if (localStack[range].getFunctionName().includes("new ")) {
          isConstructor = true;
        } else {
          isConstructor = false;
        }
      } else {
        isConstructor = false;
      }
      const isClass: boolean =
        (localStack[range].getMethodName() !== null &&
          localStack[range].getTypeName() !== "Object" &&
          localStack[range].getTypeName() !== "Array" &&
          localStack[range].getTypeName() !== "String" &&
          localStack[range].getTypeName() !== "Number" &&
          localStack[range].getTypeName() !== "Boolean") ||
        isConstructor;
      return {
        filePath: this.cleanPath(localStack[range].getFileName()),
        fullFilePath: localStack[range].getFileName(),
        lineNumber: localStack[range].getLineNumber(),
        lineColumm: localStack[range].getColumnNumber(),
        methodName: localStack[range].getMethodName(),
        functionName: localStack[range].getFunctionName(),
        isClass,
        isConstructor: isConstructor,
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
    return {
      total: this.allLogObj.length,
      allLogObj: { data: this.allLogObj },
    };
  }
  protected getLoggedTime(): string {
    return `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
  }
}
