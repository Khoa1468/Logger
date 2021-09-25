import { ReturnType } from "./LoggerReturnType.js";
import callsites from "callsites";
import { LoggerInterface, ReturnGetTimeAndType } from "./LoggerInterface.js";
import { LoggerProperty } from "./LoggerProperty.js";

const date = new Date();

export class LoggerMethod extends LoggerProperty {
  private cleanPath(path: string): string {
    return path.replace(/file:\/\/\//, "").replace(/%20/g, " ");
  }
  public getTimeAndType(
    type: "Log" | "Error" | "Info" | "Warn"
  ): ReturnGetTimeAndType {
    const filePath = this.cleanPath(callsites()[2].getFileName());
    const fullFilePath = callsites()[2].getFileName();
    const lineNumber = callsites()[2].getLineNumber();
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
              this.isDisplayRootFile ? `File: "${filePath}:${lineNumber}"` : ""
            }]`
          : ""
      }`,
      filePath,
      lineNumber,
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
    type: "log" | "warn" | "error" | "info",
    objToReturn: ReturnGetTimeAndType,
    message: unknown[],
    setting?: LoggerInterface
  ): ReturnType {
    return {
      type: type,
      message: message[0],
      data: message,
      loggedAt: `${this.loggedAt}`,
      filePath: objToReturn.filePath,
      fullFilePath: objToReturn.fullFilePath,
      lineNumber: objToReturn.lineNumber,
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
