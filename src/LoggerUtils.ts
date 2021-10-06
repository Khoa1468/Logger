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
    color: string = (chalk.Color = "white")
  ): IOReturnGetTimeAndType {
    const filePath = this.cleanPath(callsites()[3].getFileName());
    const fullFilePath = callsites()[3].getFileName();
    const lineNumber = callsites()[3].getLineNumber();
    const lineColumm = callsites()[3].getColumnNumber();
    return {
      ToString: `${
        this.isType || this.isLoggedAt || this.isDisplayRootFile
          ? `[${this.isType ? `Type: ${chalk.keyword(color)(type)}` : ""}${
              this.isLoggedAt
                ? `${this.isType ? `, ` : ""}Time: ${this.loggedAt}${
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

  public getErrorStack(stack: StackFrame[]): IOErrorStack {
    let isConstructor = false;
    if (stack[0].getFunctionName() !== null) {
      if (stack[0].getFunctionName().includes("new ")) {
        isConstructor = true;
      } else {
        isConstructor = false;
      }
    } else {
      isConstructor = false;
    }
    const isClass =
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
  }

  public setSettings({
    instanceName = this.name,
    isLoggedAt = this.isLoggedAt,
    isType = this.isType,
    isDisplayRootFile = this.isDisplayRootFile,
    cagetoryName = this.cagetoryName,
    format = this.format,
  }: IOLoggerInterface): void {
    this.name = instanceName;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
    this.cagetoryName = cagetoryName;
    this.format = format;
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
    };
  }

  get loggerName(): string {
    return this.name;
  }
  set loggerName(newName: string) {
    if (newName.length > 1) {
      this.loggerName = newName;
    } else {
      throw Error("newName error");
    }
  }
  toJson(data: IOReturnType): string {
    return JSON.stringify(data);
  }
  toPretty(data: string): IOReturnType {
    return JSON.parse(data);
  }
  public getAllLogObj(): IOAllLogObj {
    return {
      total: this.allLoggerObj.length,
      allLogObj: { data: this.allLoggerObj },
    };
  }
}
