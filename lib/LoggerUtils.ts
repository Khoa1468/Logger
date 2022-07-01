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

const parse: (error: Error) => StackFrame[] =
  ErrorStackParser.parse.bind(ErrorStackParser);

export class LoggerUtils<P extends {}> extends LoggerEvent {
  protected _name: string = "";
  protected _cagetoryName: string = "";
  protected _hostname = hostname();
  protected _format: "hidden" | "json" | "pretty" = "hidden";
  protected _short: boolean = false;
  protected _childProps: P;
  protected _useColor: boolean;
  private _pid = process.pid;
  protected _levelLog: IOLevelLog = IOLevelLog.NONE;
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
    this._name = instanceName;
    this._cagetoryName = cagetoryName;
    this._format = format;
    this._short = short;
    this._levelLog = levelLog;
    this._childProps = childOpt;
    this._useColor = useColor;
    this.setMaxListeners(0);
  }
  private _formatString(...data: any[]): string {
    return format.apply(null, [...data]);
  }
  private _write(...data: any[]): void {
    process.stdout.write(this._formatString(...data, "\n"));
  }
  public getBindingOpt(): Readonly<P> {
    return Object.freeze(this._childProps);
  }
  protected _cleanPath(path: string | undefined): string {
    if (path === undefined) return "";
    return path.replace(/file:\/\/\//, "").replace(/%20/g, " ");
  }
  public getTimeAndType(
    type: string,
    color: typeof ForegroundColor = (chalk.Color = "white"),
    loggedAt: string
  ): IOReturnGetTimeAndType {
    const frame = parse(new Error("Genesis Error"))[3];
    const filePath: string = this._cleanPath(frame.getFileName());
    const lineNumber: number | undefined = frame.getLineNumber();
    const lineColumm: number | undefined = frame.getColumnNumber();
    const prefixString = this._useColor
      ? chalk[color](
          `[Type: ${type}, Time: ${loggedAt}, File: "${filePath}:${lineNumber}:${lineColumm}", PID: ${
            this._pid
          }] ${chalk.whiteBright(`[${chalk.cyanBright(this._cagetoryName)}]`)}`
        )
      : `[Type: ${type}, Time: ${loggedAt}, File: "${filePath}:${lineNumber}:${lineColumm}", PID: ${this._pid}] [${this._cagetoryName}]`;
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
        filePath: this._cleanPath(stack[0].getFileName()),
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
        filePath: this._cleanPath(localStack[range].getFileName()),
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
    instanceName = this._name,
    cagetoryName = this._cagetoryName,
    format = this._format,
    levelLog = this._levelLog,
    short = this._short,
    useColor = this._useColor,
  }: IOLoggerInterface): void {
    this.emit("settingChange", this.listSetting(), {
      ...this.listSetting(),
      instanceName,
      cagetoryName,
      format,
      levelLog,
      hostName: this._hostname,
      short,
      useColor,
    });
    this._name = instanceName;
    this._cagetoryName = cagetoryName;
    this._format = format;
    this._short = short;
    this._useColor = useColor;
    if (this._levelLog !== levelLog) {
      this.emit("levelChange", levelLog, this._levelLog);
      this._levelLog = levelLog;
    }
  }
  public listSetting(): IOSetting {
    return {
      instanceName: this._name,
      cagetoryName: this._cagetoryName,
      hostName: this._hostname,
      format: this._format,
      levelLog: this._levelLog,
      useColor: this._useColor,
    };
  }
  public get loggerName(): string {
    return this._name;
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
  protected _getLoggedTime(): string {
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
  protected _censor(censor: any) {
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
  protected _checkLevel(range: IOLevelLog): boolean {
    return this._levelLog >= range;
  }
  protected _printFatalLog(
    logObject: IOReturnType<IOReturnError[], P>,
    errors: Error[] = []
  ) {
    let stringToPrint = "";
    if (!this._short) {
      if (!logObject.data) {
      } else {
        stringToPrint += this._formatString(
          `${logObject.fullPrefix.ToString}\n`
        );
      }
    } else {
    }
    stringToPrint +=
      "--------------------------------------------------------------------------";
    if (logObject.data.length < 1) return;
    if (this._format === "pretty") {
      this._write(stringToPrint);
      for (var i = 0, len = logObject.data.length; i < len; i++) {
        let err = logObject.data[i].defaultError;
        this._writePrettyFatal(err);
      }
      this.emit(
        "fatalLogging",
        this._levelLog,
        logObject,
        new Date(),
        logObject.fullPrefix.ToString,
        errors
      );
    }
  }
  protected _printPrettyLog<T extends any[]>(
    logObject: IOReturnType<T, P>,
    errors: Error[] = []
  ): void {
    let stringToPrint = "";
    if (!this._short) {
      if (!logObject.data) {
      } else {
        stringToPrint += this._formatString(
          `${logObject.fullPrefix.ToString} `
        );
      }
    } else {
    }
    stringToPrint += this._formatString(...logObject.data);
    if (!this._checkLevel(logObject.levelRange)) return;
    if (logObject.levelLog !== "fatal") {
      this._write(stringToPrint);
    } else {
      this._printFatalLog(logObject, errors);
    }
  }
  protected _printJsonLog<T extends any[]>(
    logObject: IOReturnType<T, P>,
    errors: Error[] = []
  ): void {
    if (logObject.levelLog === "fatal") {
      this.emit(
        "fatalLogging",
        this._levelLog,
        logObject,
        new Date(),
        logObject.fullPrefix.ToString,
        errors
      );
    }
    let stringToPrint = "";
    if (!this._short) {
      if (!logObject.data) {
      } else {
        stringToPrint += this._formatString(
          `${logObject.fullPrefix.ToString} `
        );
      }
    } else {
    }
    stringToPrint += this._formatString(JSON.stringify(logObject));
    this._write(stringToPrint);
  }
  protected _printHiddenLog<T extends any[]>(
    logObject: IOReturnType<T, P>,
    errors: Error[] = []
  ) {
    if (logObject.levelLog === "fatal") {
      this.emit(
        "fatalLogging",
        this._levelLog,
        logObject,
        new Date(),
        logObject.fullPrefix.ToString,
        errors
      );
    }
  }
  protected _handleLog<T extends any[]>(
    type: IOLevelLogId,
    message: IOStd<T>,
    color: typeof ForegroundColor = (chalk.Color = "white"),
    prefix: string = "",
    levelRange: IOLevelLog = 0,
    errors: Error[] = []
  ): IOReturnType<T, P> {
    this.emit("willLog", type, message, prefix, levelRange, new Date());
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const prefixName = prefix ?? type.charAt(0).toUpperCase() + type.slice(1);
    const timeAndType = this.getTimeAndType(prefixName, color, loggedAt);
    const logObject: IOReturnType<T, P> = this._makeLogObject(
      type,
      message,
      timeAndType,
      prefixName,
      levelRange,
      color
    );
    try {
      this.emit(
        "logging",
        this._levelLog,
        logObject,
        this._formatString(...logObject.data),
        new Date(),
        logObject.fullPrefix.ToString
      );
      if (!this._checkLevel(levelRange)) return logObject;
      if (this._format === "pretty") {
        this._printPrettyLog(logObject, errors);
      } else if (this._format === "json") {
        this._printJsonLog(logObject);
      } else {
        this._printHiddenLog(logObject, errors);
      }
    } catch (e) {
      this.emit("error", e.stack as string, e as Error);
    }
    return logObject;
  }
  protected _getDataError<T extends object>(
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
        user: this._hostname,
        isError: true,
        ...this.getErrorStack(stack),
      });
    }
    return returnLogObject;
  }
  protected _writePrettyFatal(err: Error) {
    this._write(
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
  protected _makeLogObject<T extends any[]>(
    type: IOLevelLogId,
    message: T,
    fullPrefix: IOReturnGetTimeAndType,
    prefix: string = "",
    levelRange: IOLevelLog = 0,
    color: typeof ForegroundColor = "black"
  ): IOReturnType<T, P> {
    const stackObj = this.getErrorStack(undefined, 4);
    return {
      levelLog: type,
      data: message,
      loggedAt: this._getLoggedTime(),
      hostName: this._hostname,
      instanceName: this.loggerName,
      cagetory: this._cagetoryName,
      ...stackObj,
      setting: this.listSetting(),
      bindingProps: this._childProps,
      toJson() {
        return JSON.stringify(this);
      },
      pid: this._pid,
      prefix,
      levelRange,
      color,
      fullPrefix,
    };
  }
  public warn<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this._handleLog.apply(this, [
      "warn",
      message,
      "yellowBright",
      undefined,
      2,
    ]);
  }
  public error<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this._handleLog.apply(this, [
      "error",
      message,
      "redBright",
      undefined,
      1,
    ]);
  }
  public info<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this._handleLog.apply(this, [
      "info",
      message,
      "cyanBright",
      undefined,
      4,
    ]);
  }
  public fatal<T extends object>(
    error: IOErrorParam<T>
  ): IOReturnType<IOReturnError[], P> {
    const ioLogDataError: IOReturnError[] = this._getDataError(
      error,
      error.detail
    );
    return this._handleLog.apply(this, [
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
    return this._handleLog.apply(this, [
      "prefix",
      message,
      opt.color,
      opt.prefix,
      opt.levelLog,
    ]);
  }
}
