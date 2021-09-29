import callsites from "callsites";
import chalk from "chalk";
import {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOError,
  IOErrorParam,
  IOSetting,
} from "./LoggerInterfaces.js";
import { LoggerProperty } from "./LoggerProperty.js";

const date = new Date();

export class LoggerMethod extends LoggerProperty {
  protected cleanPath(path: string | null): string {
    if (path === null) return "";
    return path.replace(/file:\/\/\//, "").replace(/%20/g, " ");
  }
  public getTimeAndType(
    type: "Log" | "Error" | "Info" | "Warn" | "Fatal",
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
            }] [${this.cagetoryName}]`
          : `[${this.cagetoryName}]`
      }`,
      filePath,
      lineNumber,
      lineColumm,
      fullFilePath,
    };
  }

  protected handleLog<T>(
    type: IOLevelLogId,
    messageOrError: unknown[],
    typeTime: "Log" | "Error" | "Info" | "Warn" | "Fatal",
    color: string = (chalk.Color = "white")
  ): IOReturnType {
    const timeAndType = this.getTimeAndType(typeTime, color);
    let returnObj: IOReturnType;
    if (type !== "fatal") {
      console[type](
        `${messageOrError ? `${timeAndType.ToString}` : ""}`,
        ...messageOrError
      );
    }

    return this.returnTypeFunction(
      type,
      timeAndType,
      messageOrError,
      this.listSetting()
    );
  }

  protected handleLogFatal<T extends object>(
    errorList: IOErrorParam<T>
  ): IOReturnType {
    const timeAndType = this.getTimeAndType("Fatal", (chalk.Color = "magenta"));
    console.error(
      `${
        errorList
          ? `${timeAndType.ToString}\n--------------------------------------------------------------------------`
          : ""
      }`
    );
    errorList.errors.forEach((err: any) => {
      console.error("", "Message:", chalk.redBright(err.message), "\n");
      console.error(
        "",
        `============================================== \n`,
        ""
      );
      console.error("", `${chalk.bgRed("STACK:")} \n`, "");
      console.error("", err.stack, "\n");
      return err;
    });
    console.error(
      `--------------------------------------------------------------------------`
    );
    return this.returnFatalTypeFunction(
      timeAndType,
      errorList.errors,
      errorList.detail,
      this.listSetting()
    );
  }

  public setSettings({
    instanceName = this.name,
    isLoggedAt = this.isLoggedAt,
    isType = this.isType,
    isDisplayRootFile = this.isDisplayRootFile,
    cagetoryName = this.cagetoryName,
    hostName = this.hostname,
  }: IOSetting) {
    this.name = instanceName;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
    this.cagetoryName = cagetoryName;
    this.hostname = hostName;
  }

  public listSetting(): IOSetting {
    return {
      instanceName: this.name,
      isLoggedAt: this.isLoggedAt,
      isType: this.isType,
      isDisplayRootFile: this.isDisplayRootFile,
      cagetoryName: this.cagetoryName,
      hostName: this.hostname,
    };
  }

  protected returnTypeFunction(
    type: IOLevelLogId,
    objToReturn: IOReturnGetTimeAndType,
    message: unknown[],
    setting?: IOSetting
  ): IOReturnType {
    return {
      levelLog: type,
      data: message,
      loggedAt: `${this.loggedAt}`,
      filePath: objToReturn.filePath,
      fullFilePath: objToReturn.fullFilePath,
      lineNumber: objToReturn.lineNumber,
      hostName: this.hostname,
      lineColumm: objToReturn.lineColumm,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
      setting,
    };
  }

  protected returnFatalTypeFunction(
    objToReturn: IOReturnGetTimeAndType,
    errors: IOError[],
    detailError: object = {},
    setting?: IOSetting
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
      hostName: this.hostname,
      filePath: objToReturn.filePath,
      fullFilePath: objToReturn.fullFilePath,
      lineNumber: objToReturn.lineNumber,
      lineColumm: objToReturn.lineColumm,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
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
