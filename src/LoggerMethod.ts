import callsites from "callsites";
import {
  LoggerInterface,
  ReturnGetTimeAndType,
  levelLogId,
  ReturnType,
} from "./LoggerInterfaces.js";
import { LoggerProperty } from "./LoggerProperty.js";

const date = new Date();

export class LoggerMethod extends LoggerProperty {
  private cleanPath(path: string): string {
    return path.replace(/file:\/\/\//, "").replace(/%20/g, " ");
  }
  public getTimeAndType(
    type: "Log" | "Error" | "Info" | "Warn" | "Fatal"
  ): ReturnGetTimeAndType {
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
              this.isType ? ", " : ""
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
  }: LoggerInterface) {
    this.name = name;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
  }

  public listSetting(): LoggerInterface {
    return {
      name: this.name,
      isLoggedAt: this.isLoggedAt,
      isType: this.isType,
      isDisplayRootFile: this.isDisplayRootFile,
    };
  }

  protected returnTypeFunction(
    type: levelLogId,
    objToReturn: ReturnGetTimeAndType,
    message: unknown[],
    setting?: LoggerInterface
  ): ReturnType {
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
