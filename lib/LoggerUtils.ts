import chalk from "chalk";
import {
  IOAllLogObj,
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOLevelLog,
  IOErrorParam,
  IOSetting,
  IOStd,
  IOReturnError,
  IOErrorStack,
  IOLevelLogList,
} from "./LoggerInterfaces.js";
import { get as callsites, StackFrame, parse } from "./stacktrace";
import { Logger as LoggerClass } from "./Logger.js";
import { hostname } from "os";

export class LoggerUtils {
  protected name: string = "";
  protected isLoggedAt: boolean = true;
  protected isType: boolean = true;
  protected isDisplayRootFile: boolean = true;
  protected cagetoryName: string = "";
  protected hostname = hostname();
  protected format: "hidden" | "json" | "pretty" = "hidden";
  protected short: boolean = false;
  protected levelLog: IOLevelLogList = [IOLevelLog.NONE];
  protected allLogObj: Array<IOReturnType<any[]>> = [];
  /**
   * This Is My Logger
   */
  constructor({
    instanceName = hostname(),
    isLoggedAt = true,
    isType = true,
    isDisplayRootFile = true,
    cagetoryName = instanceName,
    format = "hidden",
    short = false,
    levelLog = [IOLevelLog.NONE],
  }: IOLoggerInterface) {
    this.name = instanceName;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
    this.cagetoryName = cagetoryName;
    this.format = format;
    this.short = short;
    this.levelLog = levelLog;
  }
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
      // localStack.map((stack) => {
      //   console.log(stack.getFileName());
      //   console.log(stack.getLineNumber());
      // });
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
    return {
      total: this.allLogObj.length,
      allLogObj: { data: this.allLogObj },
      toJson: this.toJson(this.allLogObj, this.censor(this.allLogObj), 2),
    };
  }
  protected getLoggedTime(): string {
    return `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
  }
  public onInit(Logger: typeof LoggerClass) {}
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
  protected censor(censor: any) {
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

  protected handleLog<T extends any[]>(
    type: IOLevelLogId,
    message: IOStd<T>,
    color: string = (chalk.Color = "white"),
    prefix?: string
  ): IOReturnType<T> {
    const typeUpper = prefix ?? type.charAt(0).toUpperCase() + type.slice(1);
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      typeUpper as "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
      color,
      loggedAt
    );
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      type,
      message,
      4
    );
    this.allLogObj.push(ioLogObject);
    if (type !== "fatal" && type !== "prefix") {
      if (this.format === "pretty") {
        console[type](
          `${
            this.short
              ? ""
              : `${
                  message ? `${chalk.keyword(color)(timeAndType.ToString)}` : ""
                }`
          }`,
          ...message
        );
      } else if (this.format === "json") {
        console[type](
          `${
            this.short
              ? ""
              : `${
                  message ? `${chalk.keyword(color)(timeAndType.ToString)}` : ""
                }`
          }`,
          this.toJson(ioLogObject, this.censor(ioLogObject))
        );
        return ioLogObject;
      } else if (this.format === "hidden") {
        return ioLogObject;
      }
    } else if (type === "prefix") {
      console["log"](
        `${
          this.short
            ? ""
            : `${
                message ? `${chalk.keyword(color)(timeAndType.ToString)}` : ""
              }`
        }`,
        ...message
      );
    }

    return ioLogObject;
  }
  protected getDataError<T extends object>(
    errorList: IOErrorParam<T>,
    detail: object = {}
  ): IOReturnError[] {
    const returnLogObject: IOReturnError[] = [];
    errorList.errors.map((err: Error) => {
      const stack: StackFrame[] = parse(err);
      returnLogObject.push({
        nativeError: err.stack!,
        detail,
        user: this.hostname,
        isError: true,
        ...this.getErrorStack(stack),
      });
    });
    return returnLogObject;
  }
  protected handleLogFatal<T extends object>(
    errorList: IOErrorParam<T>
  ): IOReturnType<IOReturnError[]> {
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      "Fatal",
      (chalk.Color = "magenta"),
      loggedAt
    );
    try {
      const ioLogDataError: IOReturnError[] = this.getDataError(
        errorList,
        errorList.detail
      );
      const ioLogObject: IOReturnType<IOReturnError[]> =
        this.returnFatalTypeFunction(this.getErrorStack(), ioLogDataError);
      this.allLogObj.push(ioLogObject);
      if (this.format === "pretty") {
        console.error(
          `${
            this.short
              ? ""
              : `${
                  errorList
                    ? `${chalk.keyword("magenta")(
                        timeAndType.ToString
                      )}\n--------------------------------------------------------------------------`
                    : ""
                }`
          }`
        );
        errorList.errors.forEach((err: Error) => {
          console.error("", "Message:", chalk.redBright(err.message), "\n");
          console.error(
            "",
            `============================================== \n`,
            ""
          );
          console.error("", `${chalk.bgRed("STACK:")} \n`, "");
          console.error(
            "",
            chalk.yellow(err.stack?.replace(/at /g, `${chalk.red("• ")}`)),
            "\n"
          );
          if (errorList.errors.length >= 2) {
            console.error(
              `--------------------------------------------------------------------------`
            );
          } else {
            false;
          }
          return err;
        });
        if (errorList.errors.length < 2) {
          console.error(
            `--------------------------------------------------------------------------`
          );
        } else {
          false;
        }
      } else if (this.format === "json") {
        console.error(
          `${
            this.short
              ? ""
              : `${
                  errorList
                    ? `${chalk.keyword("magenta")(timeAndType.ToString)}`
                    : ""
                }`
          }`,
          this.toJson(ioLogObject, this.censor(ioLogObject))
        );
        return ioLogObject;
      } else if (this.format === "hidden") {
        return ioLogObject;
      }
      return ioLogObject;
    } catch (err: any) {
      this.handleLogFatal({ errors: [err] });
      return err;
    }
  }
  protected returnTypeFunction<T extends any[]>(
    type: IOLevelLogId,
    message: T,
    range: number = 3
  ): IOReturnType<T> {
    const stackObj = this.getErrorStack(undefined, range);
    return {
      levelLog: type,
      data: message,
      loggedAt: this.getLoggedTime(),
      hostName: this.hostname,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
      ...stackObj,
      setting: this.listSetting(),
      toJson() {
        return JSON.stringify(this);
      },
    };
  }
  protected returnFatalTypeFunction(
    stack: IOErrorStack,
    dataError: IOReturnError[]
  ): IOReturnType<IOReturnError[]> {
    return {
      levelLog: "fatal",
      data: dataError,
      loggedAt: this.getLoggedTime(),
      hostName: this.hostname,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
      ...stack,
      setting: this.listSetting(),
      toJson() {
        return JSON.stringify(this);
      },
    };
  }
  public log<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "log",
      message
    );
    if (this.levelLog.includes(4) || this.levelLog.includes(5)) {
      return this.handleLog("log", message);
    } else {
      this.allLogObj.push(ioLogObject);
      return ioLogObject;
    }
  }
  public warn<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "warn",
      message
    );
    if (this.levelLog.includes(2) || this.levelLog.includes(5)) {
      return this.handleLog("warn", message, (chalk.Color = "yellow"));
    } else {
      this.allLogObj.push(ioLogObject);
      return ioLogObject;
    }
  }
  public error<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "error",
      message
    );
    if (this.levelLog.includes(1) || this.levelLog.includes(5)) {
      return this.handleLog("error", message, (chalk.Color = "red"));
    } else {
      this.allLogObj.push(ioLogObject);
      return ioLogObject;
    }
  }
  public info<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "info",
      message
    );
    if (this.levelLog.includes(4) || this.levelLog.includes(5)) {
      return this.handleLog("info", message, (chalk.Color = "cyan"));
    } else {
      this.allLogObj.push(ioLogObject);
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
        ioLogDataError
      );
    if (this.levelLog.includes(1) || this.levelLog.includes(5)) {
      return this.handleLogFatal<T>(error);
    } else {
      this.allLogObj.push(ioLogObject);
      return ioLogObject;
    }
  }
  public debug<T extends any[]>(...message: IOStd<T>): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "debug",
      message
    );
    if (this.levelLog.includes(3) || this.levelLog.includes(5)) {
      return this.handleLog("debug", message, (chalk.Color = "green"));
    } else {
      this.allLogObj.push(ioLogObject);
      return ioLogObject;
    }
  }
  public prefix<T extends any[]>(
    prefix?: string,
    ...message: IOStd<T>
  ): IOReturnType<T> {
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      "prefix",
      message
    );
    if (this.levelLog.includes(4) || this.levelLog.includes(5)) {
      return this.handleLog(
        "prefix",
        message,
        (chalk.Color = "magenta"),
        prefix || "Prefix"
      );
    } else {
      this.allLogObj.push(ioLogObject);
      return ioLogObject;
    }
  }
}
