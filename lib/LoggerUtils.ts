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
    type: "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
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
  protected handleLog<T extends any[]>(
    type: IOLevelLogId,
    message: IOStd<T>,
    color: typeof ForegroundColor = (chalk.Color = "white"),
    prefix?: string,
    levelRange: IOLevelLog = 0
  ): IOReturnType<T, P> {
    this.emit("willLog", type, message, prefix, levelRange, new Date());
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
    this.emit(
      "logging",
      this.levelLog,
      ioLogObject,
      this.formatString(
        `${this.short ? "" : `${message ? `${timeAndType.ToString}` : ""}`}`,
        ...message
      ),
      new Date()
    );
    if (!this.checkLevel(levelRange)) return ioLogObject;
    if (this.format === "pretty") {
      this.write(
        `${this.short ? "" : `${message ? `${timeAndType.ToString}` : ""}`}`,
        ...message
      );
    } else if (this.format === "json") {
      this.write(
        `${this.short ? "" : `${message ? `${timeAndType.ToString}` : ""}`}`,
        this.toJson(ioLogObject, this.censor(ioLogObject)),
        "\n"
      );
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
  protected handleLogFatal<T extends object>(
    errorList: IOErrorParam<T>
  ): IOReturnType<IOReturnError[], P> {
    this.emit("willLog", "fatal", errorList.errors, undefined, 1, new Date());
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      "Fatal",
      (chalk.Color = "magentaBright"),
      loggedAt
    );
    try {
      const ioLogDataError: IOReturnError[] = this.getDataError(
        errorList,
        errorList.detail
      );
      const ioLogObject: IOReturnType<IOReturnError[], P> =
        this.returnTypeFunction("fatal", ioLogDataError);
      this.emit(
        "logging",
        this.levelLog,
        ioLogObject,
        this.formatString(
          `${timeAndType.ToString}`,
          "This is A Fatal Logging Can't Print Out"
        ),
        new Date()
      );
      this.emit(
        "fatalLogging",
        this.levelLog,
        ioLogObject,
        new Date(),
        timeAndType.ToString,
        ...errorList.errors
      );
      if (!this.checkLevel(1)) return ioLogObject;
      if (errorList.errors.length < 1) return ioLogObject;
      if (this.format === "pretty") {
        this.write(
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
          this.writePrettyFatal(err);
        }
      } else if (this.format === "json") {
        this.write(
          `${
            this.short ? "" : `${errorList ? `${timeAndType.ToString}` : ""}`
          }`,
          this.toJson(ioLogObject, this.censor(ioLogObject))
        );
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
      bindingProps: this.childProps,
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
      (chalk.Color = "yellowBright"),
      undefined,
      2
    );
  }
  public error<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this.handleLog(
      "error",
      message,
      (chalk.Color = "redBright"),
      undefined,
      1
    );
  }
  public info<T extends any[]>(...message: IOStd<T>): IOReturnType<T, P> {
    return this.handleLog(
      "info",
      message,
      (chalk.Color = "cyanBright"),
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
    opt = {
      prefix: opt.prefix ?? "Prefix",
      color: opt.color ?? "magentaBright",
      levelLog: opt.levelLog ?? 4,
    };
    return this.handleLog(
      "prefix",
      message,
      opt.color,
      opt.prefix,
      opt.levelLog
    );
  }
}
