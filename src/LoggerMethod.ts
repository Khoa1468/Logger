import callsites from "callsites";
import {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOError,
} from "./LoggerInterfaces.js";
import { LoggerProperty } from "./LoggerProperty.js";

const date = new Date();

export class LoggerMethod extends LoggerProperty {
  private cleanPath(path: string): string {
    return path.replace(/file:\/\/\//, "").replace(/%20/g, " ");
  }
  public getTimeAndType(
    type: "Log" | "Error" | "Info" | "Warn" | "Fatal"
  ): IOReturnGetTimeAndType {
    const filePath = this.cleanPath(callsites()[2].getFileName());
    const fullFilePath = callsites()[2].getFileName();
    const lineNumber = callsites()[2].getLineNumber();
    const lineColumm = callsites()[2].getColumnNumber();
    return {
      ToString: `${
        this.isType || this.isLoggedAt || this.isDisplayRootFile
          ? `[${this.isType ? `Type: ${type}` : ""}${
              this.isLoggedAt
                ? `${this.isType ? `, ` : ""}Time: ${this.loggedAt}${
                    this.isDisplayRootFile ? "," : ""
                  }`
                : ""
            }${this.isLoggedAt && this.isDisplayRootFile ? " " : ""}${
              this.isType && this.isDisplayRootFile ? ", " : ""
            }${
              this.isDisplayRootFile
                ? `File: "${filePath}:${lineNumber}:${lineColumm}"`
                : ""
            }]`
          : ""
      }`,
      filePath,
      lineNumber,
      lineColumm,
      fullFilePath,
    };
  }

  public setSettings({
    name = this.name,
    isLoggedAt = this.isLoggedAt,
    isType = this.isType,
    isDisplayRootFile = this.isDisplayRootFile,
  }: IOLoggerInterface) {
    this.name = name;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
  }

  public listSetting(): IOLoggerInterface {
    return {
      name: this.name,
      isLoggedAt: this.isLoggedAt,
      isType: this.isType,
      isDisplayRootFile: this.isDisplayRootFile,
    };
  }

  protected returnTypeFunction(
    type: IOLevelLogId,
    objToReturn: IOReturnGetTimeAndType,
    message: unknown[],
    setting?: IOLoggerInterface
  ): IOReturnType {
    return {
      levelLog: type,
      data: message,
      loggedAt: `${this.loggedAt}`,
      filePath: objToReturn.filePath,
      fullFilePath: objToReturn.fullFilePath,
      lineNumber: objToReturn.lineNumber,
      lineColumm: objToReturn.lineColumm,
      user: this.loggerName,
      setting,
    };
  }

  protected returnFatalTypeFunction(
    objToReturn: IOReturnGetTimeAndType,
    errors: IOError[],
    detailError: object = {},
    setting?: IOLoggerInterface
  ): IOReturnType {
    return {
      levelLog: "fatal",
      data: {
        nativeError: errors,
        detail: detailError,
        user: this.loggerName,
        isError: true,
        filePath: objToReturn.filePath,
        fullFilePath: objToReturn.fullFilePath,
        lineNumber: objToReturn.lineNumber,
        lineColumm: objToReturn.lineColumm,
      },
      loggedAt: `${this.loggedAt}`,
      filePath: objToReturn.filePath,
      fullFilePath: objToReturn.fullFilePath,
      lineNumber: objToReturn.lineNumber,
      lineColumm: objToReturn.lineColumm,
      user: this.loggerName,
      setting,
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
}
