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
  IOPrefixOption,
  IOReturnType,
} from "./LoggerInterfaces.js";
import { hostname } from "os";
import { format } from "util";
import ErrorStackParser from "error-stack-parser";
import { StackFrame } from "error-stack-parser";
import type { ForegroundColor } from "chalk";
import { LoggerEvent } from "./LoggerEvents.js";

const parse = ErrorStackParser.parse.bind(ErrorStackParser);

export class LoggerUtils<P extends {}> extends LoggerEvent {
  protected name: string = "";
  protected cagetoryName: string = "";
  protected hostname = hostname();
  protected format: "hidden" | "json" | "pretty" = "hidden";
  protected short: boolean = false;
  protected childProps: P;
  protected useColor: boolean;
  private pid = process.pid;
  protected levelLog: IOLevelLog = IOLevelLog.NONE;
  /**
   * This Is My Logger
   */
  constructor(
    {
      instanceName = hostname(),
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = IOLevelLog.NONE,
      useColor = true,
    }: IOLoggerInterface,
    childOpt: P = {} as P
  ) {
    super();
    this.name = instanceName;
    this.cagetoryName = cagetoryName;
    this.format = format;
    this.short = short;
    this.levelLog = levelLog;
    this.childProps = childOpt;
    this.useColor = useColor;
    this.setMaxListeners(0);
  }
  private formatString(...data: any[]): string {
    return format.apply(null, [...data]);
  }
  private write(...data: any[]): void {
    process.stdout.write(this.formatString(...data, "\n"));
  }
  public getBindingOpt(): Readonly<P> {
    return Object.freeze(this.childProps);
  }
  protected cleanPath(path: string | undefined): string {
    if (path === undefined) return "";
    return path.replace(/file:\/\/\//, "").replace(/%20/g, " ");
  }
  public getTimeAndType(
    type: string,
    color: typeof ForegroundColor = (chalk.Color = "white"),
    loggedAt: string
  ): IOReturnGetTimeAndType {
    const frame = parse(new Error("Genesis Error"))[3];
    const filePath: string = this.cleanPath(frame.getFileName());
    const lineNumber: number | undefined = frame.getLineNumber();
    const lineColumm: number | undefined = frame.getColumnNumber();
    const prefixString = this.useColor
      ? chalk[color](
          `[Type: ${type}, Time: ${loggedAt}, File: "${filePath}:${lineNumber}:${lineColumm}", PID: ${
            this.pid
          }] ${chalk.whiteBright(`[${chalk.cyanBright(this.cagetoryName)}]`)}`
        )
      : `[Type: ${type}, Time: ${loggedAt}, File: "${filePath}:${lineNumber}:${lineColumm}", PID: ${this.pid}] [${this.cagetoryName}]`;
    return {
      ToString: prefixString,
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
        methodName: stack[0].getFunctionName(),
        functionName: stack[0].getFunctionName(),
        isConstructor: stack[0].getIsConstructor(),
      };
    } else {
      const localStack = parse(new Error("Genesis Error"));
      return {
        filePath: this.cleanPath(localStack[range].getFileName()),
        fullFilePath: localStack[range].getFileName(),
        lineNumber: localStack[range].getLineNumber(),
        lineColumm: localStack[range].getColumnNumber(),
        methodName: localStack[range].getFunctionName(),
        functionName: localStack[range].getFunctionName(),
        isConstructor: localStack[range].getIsConstructor(),
      };
    }
  }
  public setSettings({
    instanceName = this.name,
    cagetoryName = this.cagetoryName,
    format = this.format,
    levelLog = this.levelLog,
    short = this.short,
    useColor = this.useColor,
  }: IOLoggerInterface): void {
    this.emit("settingChange", this.listSetting(), {
      ...this.listSetting(),
      instanceName,
      cagetoryName,
      format,
      levelLog,
      hostName: this.hostname,
      short,
      useColor,
    });
    this.name = instanceName;
    this.cagetoryName = cagetoryName;
    this.format = format;
    this.short = short;
    this.useColor = useColor;
    if (this.levelLog !== levelLog) {
      this.emit("levelChange", levelLog, this.levelLog);
      this.levelLog = levelLog;
    }
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
      this.emit("loggerNameChange", this.loggerName, newName);
      this.emit("settingChange", this.listSetting(), {
        ...this.listSetting(),
        instanceName: newName,
      });
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
  protected checkLevel(range: IOLevelLog): boolean {
    return this.levelLog >= range;
  }
  protected printFatalLog(
    logObject: IOReturnType<IOReturnError[], P>,
    timeAndType: IOReturnGetTimeAndType,
    errors: Error[] = []
  ) {
    let errorString = "";

    if (logObject.data.length < 1) return;
    if (this.format === "pretty") {
      this.write(
        `${
          this.short
            ? ""
            : `${
                logObject.data
                  ? `${timeAndType.ToString}\n--------------------------------------------------------------------------`
                  : ""
              }`
        }`
      );
      for (var i = 0, len = logObject.data.length; i < len; i++) {
        let err = logObject.data[i].defaultError;
        this.writePrettyFatal(err);
        errorString += this.formatString(err);
      }
      this.emit(
        "fatalLogging",
        this.levelLog,
        logObject,
        new Date(),
        timeAndType.ToString,
        errors
      );
    }
  }
  protected printPrettyLog<T extends any[]>(
    logObject: IOReturnType<T, P>,
    errors: Error[] = []
  ): void {
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const timeAndType = this.getTimeAndType(
      logObject.prefix,
      logObject.color,
      loggedAt
    );
    const stringToPrint = this.formatString(
      `${
        this.short ? "" : `${logObject.data ? `${timeAndType.ToString}` : ""}`
      }`,
      ...logObject.data
    );
    if (!this.checkLevel(logObject.levelRange)) return;
    if (logObject.levelLog !== "fatal") {
      this.write(stringToPrint);
    } else {
      this.printFatalLog(logObject, timeAndType, errors);
    }
  }
  protected printJsonLog<T extends any[]>(
    logObject: IOReturnType<T, P>,
    errors: Error[] = []
  ): void {
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const timeAndType = this.getTimeAndType(
      logObject.prefix,
      logObject.color,
      loggedAt
    );
    if (logObject.levelLog === "fatal") {
      this.emit(
        "fatalLogging",
        this.levelLog,
        logObject,
        new Date(),
        timeAndType.ToString,
        errors
      );
    }
    this.write(
      `${
        this.short ? "" : `${logObject.data ? `${timeAndType.ToString}` : ""}`
      }`,
      this.toJson(logObject, this.censor(logObject)),
      "\n"
    );
  }
  protected handleLog<T extends any[]>(
    type: IOLevelLogId,
    message: IOStd<T>,
    color: typeof ForegroundColor = (chalk.Color = "white"),
    prefix?: string,
    levelRange: IOLevelLog = 0,
    errors: Error[] = []
  ): IOReturnType<T, P> {
    this.emit("willLog", type, message, prefix, levelRange, new Date());
    const ioLogObject: IOReturnType<T, P> = this.returnTypeFunction(
      type,
      message,
      prefix ?? type.charAt(0).toUpperCase() + type.slice(1),
      levelRange,
      color
    );
    this.emit(
      "logging",
      this.levelLog,
      ioLogObject,
      this.formatString(...ioLogObject.data),
      new Date()
    );
    if (!this.checkLevel(levelRange)) return ioLogObject;
    if (this.format === "pretty") {
      this.printPrettyLog(ioLogObject, errors);
    } else if (this.format === "json") {
      this.printJsonLog(ioLogObject);
    }
    return ioLogObject;
  }
  protected getDataError<T extends object>(
    errorList: IOErrorParam<T>,
    detail: object = {}
  ): IOReturnError[] {
    const returnLogObject: IOReturnError[] = [];
    for (const err of errorList.errors) {
      const stack = parse(err);
      returnLogObject.push({
        defaultError: err,
        nativeError: err.stack!,
        detail,
        user: this.hostname,
        isError: true,
        ...this.getErrorStack(stack),
      });
    }
    return returnLogObject;
  }
  protected writePrettyFatal(err: Error) {
    this.write(
      "",
      "Message:",
      chalk.redBright(err.message),
      "\n\n",
      `${chalk.bgRed("STACK:")} \n\n`,
      chalk.yellow(err.stack?.replace(/at /g, `${chalk.red("• ")}`)),
      "\n",
      `--------------------------------------------------------------------------`
    );
  }
  protected returnTypeFunction<T extends any[]>(
    type: IOLevelLogId,
    message: T,
    prefix: string = "",
    levelRange: IOLevelLog = 0,
    color: typeof ForegroundColor = "black"
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
      bindingProps: this.childProps,
      toJson() {
        return JSON.stringify(this);
      },
      pid: this.pid,
      prefix,
      levelRange,
      color,
    };
  }
  public warn<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this.handleLog.apply(this, [
      "warn",
      message,
      (chalk.Color = "yellowBright"),
      undefined,
      2,
    ]);
  }
  public error<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this.handleLog.apply(this, [
      "error",
      message,
      (chalk.Color = "redBright"),
      undefined,
      1,
    ]);
  }
  public info<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this.handleLog.apply(this, [
      "info",
      message,
      (chalk.Color = "cyanBright"),
      undefined,
      4,
    ]);
  }
  public fatal<T extends object>(
    error: IOErrorParam<T>
  ): IOReturnType<IOReturnError[], P> {
    const ioLogDataError: IOReturnError[] = this.getDataError(
      error,
      error.detail
    );
    return this.handleLog.apply(this, [
      "fatal",
      ioLogDataError,
      "magentaBright",
      undefined,
      1,
    ]);
  }
  public prefix<T extends any[]>(
    opt: IOPrefixOption,
    ...message: IOStd<T>
  ): IOReturnType<T, P> {
    opt = {
      prefix: opt.prefix ?? "Prefix",
      color: opt.color ?? "magentaBright",
      levelLog: opt.levelLog ?? 4,
    };
    return this.handleLog.apply(this, [
      "prefix",
      message,
      opt.color,
      opt.prefix,
      opt.levelLog,
    ]);
  }
}
