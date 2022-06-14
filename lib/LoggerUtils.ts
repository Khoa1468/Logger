import chalk from "chalk";
import {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOLevelLog,
  IOErrorParam,
  IOSetting,
  IOStd,
  IOReturnError,
  IOErrorStack,
  IOLevelLogList,
  IOPrefixOption,
  IOReturnType,
  ChildLogger,
  IOChildLoggerProperty,
} from "./LoggerInterfaces.js";
import { get as callsites, StackFrame, parse } from "./stacktrace";
import { Logger as LoggerClass } from "./Logger.js";
import { hostname } from "os";
import { format } from "util";

export class LoggerUtils<P extends {}> {
  protected name: string = "";
  protected cagetoryName: string = "";
  protected hostname = hostname();
  protected format: "hidden" | "json" | "pretty" = "hidden";
  protected short: boolean = false;
  protected childProp: P;
  protected useColor: boolean;
  private pid = process.pid;
  protected levelLog: IOLevelLogList = [IOLevelLog.NONE];
  /**
   * This Is My Logger
   */
  constructor(
    {
      instanceName = hostname(),
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = [IOLevelLog.NONE],
      useColor = true,
    }: IOLoggerInterface,
    childOpt: P = {} as P
  ) {
    this.name = instanceName;
    this.cagetoryName = cagetoryName;
    this.format = format;
    this.short = short;
    this.levelLog = levelLog;
    this.childProp = childOpt;
    this.useColor = useColor;
  }
  private write(...data: any[]): void {
    process.stdout.write(format.apply(null, [...data, "\n"]));
  }
  private errWrite(...data: any[]): void {
    process.stderr.write(format.apply(null, [...data, "\n"]));
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
    const basePrefixString = `[Type: ${type}, Time: ${loggedAt}, File: "${filePath}:${lineNumber}:${lineColumm}", PID: ${
      this.pid
    }] ${
      this.useColor
        ? chalk.whiteBright(`[${chalk.cyanBright(this.cagetoryName)}]`)
        : `[${this.cagetoryName}]`
    }`;
    const prefixString = this.useColor
      ? chalk.keyword(color)(basePrefixString)
      : basePrefixString;
    return {
      ToString: prefixString,
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
    cagetoryName = this.cagetoryName,
    format = this.format,
    levelLog = this.levelLog,
  }: IOLoggerInterface): void {
    this.name = instanceName;
    this.cagetoryName = cagetoryName;
    this.format = format;
    this.levelLog = levelLog;
  }
  public listSetting(): IOSetting {
    return {
      instanceName: this.name,
      cagetoryName: this.cagetoryName,
      hostName: this.hostname,
      format: this.format,
      levelLog: this.levelLog,
      useColor: this.useColor,
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
  protected getLoggedTime(): string {
    return `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
  }
  public toJson(
    data: any,
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    spacing?: number | undefined | string
  ): string {
    return JSON.stringify(data, replacer, spacing);
  }
  public toPretty<T extends any[]>(data: string): IOReturnType<T, P> {
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
    prefix?: string,
    levelRange: IOLevelLog = 0
  ): IOReturnType<T, P> {
    const typeUpper = prefix ?? type.charAt(0).toUpperCase() + type.slice(1);
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      typeUpper as "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
      color,
      loggedAt
    );
    const ioLogObject: IOReturnType<T, P> = this.returnTypeFunction(
      type,
      message
    );
    if (this.levelLog.includes(levelRange) || this.levelLog.includes(5)) {
      if (type !== "fatal") {
        if (this.format === "pretty") {
          this.write(
            `${
              this.short ? "" : `${message ? `${timeAndType.ToString}` : ""}`
            }`,
            ...message
          );
          return ioLogObject;
        } else if (this.format === "json") {
          this.write(
            `${
              this.short ? "" : `${message ? `${timeAndType.ToString}` : ""}`
            }`,
            this.toJson(ioLogObject, this.censor(ioLogObject))
          );
          return ioLogObject;
        }
      }
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
  ): IOReturnType<IOReturnError[], P> {
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
      const ioLogObject: IOReturnType<IOReturnError[], P> =
        this.returnTypeFunction("fatal", ioLogDataError);
      if (this.levelLog.includes(1) || this.levelLog.includes(5)) {
        if (this.format === "pretty") {
          this.errWrite(
            `${
              this.short
                ? ""
                : `${
                    errorList
                      ? `${timeAndType.ToString}\n--------------------------------------------------------------------------`
                      : ""
                  }`
            }`
          );
          for (var i = 0, len = errorList.errors.length; i < len; i++) {
            let err = errorList.errors[i];
            this.errWrite("", "Message:", chalk.redBright(err.message), "\n");
            this.errWrite("", `${chalk.bgRed("STACK:")} \n`);
            this.errWrite(
              "",
              chalk.yellow(err.stack?.replace(/at /g, `${chalk.red("• ")}`))
            );
            if (errorList.errors.length >= 1) {
              this.errWrite(
                `--------------------------------------------------------------------------`
              );
            } else {
              false;
            }
          }
        } else if (this.format === "json") {
          this.errWrite(
            `${
              this.short ? "" : `${errorList ? `${timeAndType.ToString}` : ""}`
            }`,
            this.toJson(ioLogObject, this.censor(ioLogObject))
          );
          return ioLogObject;
        }
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
    message: T
  ): IOReturnType<T, P> {
    const stackObj = this.getErrorStack(undefined, 4);
    return {
      levelLog: type,
      data: message,
      loggedAt: this.getLoggedTime(),
      hostName: this.hostname,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
      ...stackObj,
      setting: this.listSetting(),
      ...this.childProp,
      toJson() {
        return JSON.stringify(this);
      },
      pid: this.pid,
    };
  }
  public warn<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this.handleLog(
      "warn",
      message,
      (chalk.Color = "yellow"),
      undefined,
      2
    );
  }
  public error<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this.handleLog(
      "error",
      message,
      (chalk.Color = "red"),
      undefined,
      1
    );
  }
  public info<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this.handleLog(
      "info",
      message,
      (chalk.Color = "cyan"),
      undefined,
      4
    );
  }
  public fatal<T extends object>(
    error: IOErrorParam<T>
  ): IOReturnType<IOReturnError[], P> {
    return this.handleLogFatal<T>(error);
  }
  public prefix<T extends any[]>(
    opt: IOPrefixOption,
    ...message: IOStd<T>
  ): IOReturnType<T, P> {
    opt = { prefix: opt.prefix ?? "Prefix", color: opt.color ?? "magenta" };
    return this.handleLog("prefix", message, opt.color, opt.prefix, 4);
  }
  public child<T extends {}, LP extends {} = {}>(
    bindingOpt?: T,
    loggerOpt?: LP
  ): ChildLogger<P & T, LP> {
    const childLogger: LoggerClass<P & T> = new LoggerClass<P & T>(
      this.listSetting(),
      {
        ...this.childProp,
        ...(bindingOpt ?? ({} as T)),
      }
    );

    return Object.assign(childLogger, {
      loggerProps: loggerOpt,
    } as IOChildLoggerProperty<LP>);
  }
}
