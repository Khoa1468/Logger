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
  IOPrefixOption,
  IOReturnType,
  IOTransportProvider,
  TransportType,
} from "./LoggerInterfaces.js";
import { hostname } from "os";
import { format } from "util";
import type { ForegroundColor } from "chalk";
import { LoggerEvent } from "./LoggerEvents.js";
import { Helper } from "./HelperFunctions.js";
import { TransportFileProvider } from "./TransportFile.js";

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
  private _logLevels: { [key in IOLevelLogId]: number } = {
    fatal: 1,
    error: 1,
    warn: 2,
    info: 3,
    prefix: 3,
  };
  private _transportProviders: IOTransportProvider[] = [];
  private _fileTransports: TransportFileProvider[] = [];
  private _transportType: TransportType;
  private _useOneColor?: typeof ForegroundColor;
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
      transportType = "none",
      stdout,
      useOneColor,
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
    this._transportType = transportType;
    this._useOneColor = useOneColor;
    this.setMaxListeners(20);
    this._write = stdout ? stdout : this._write;
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
  public setSettings({
    instanceName = this._name,
    cagetoryName = this._cagetoryName,
    format = this._format,
    levelLog = this._levelLog,
    short = this._short,
    useColor = this._useColor,
    transportType = this._transportType,
  }: IOLoggerInterface): this {
    this.emit("settingChange", this.listSetting(), {
      ...this.listSetting(),
      instanceName,
      cagetoryName,
      format,
      levelLog,
      hostName: this._hostname,
      short,
      useColor,
      transportType,
    });
    this._name = instanceName;
    this._cagetoryName = cagetoryName;
    this._format = format;
    this._short = short;
    this._useColor = useColor;
    this._transportType = transportType;
    if (this._levelLog !== levelLog) {
      this.emit("levelChange", levelLog, this._levelLog);
      this._levelLog = levelLog;
    }

    return this;
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
  protected _printFatalLog(
    logObject: IOReturnType<IOReturnError[], P>,
    errors: Error[] = []
  ): void {
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
    let prefix = "";
    if (!this._short) {
      if (!logObject.data) {
      } else {
        prefix += this._formatString(`${logObject.fullPrefix.ToString} `);
      }
    } else {
    }
    if (logObject.levelLog !== "fatal") {
      this._write(prefix, ...logObject.data);
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
    stringToPrint += this._formatString(
      Helper.toJson.apply(this, [logObject, Helper.censor(logObject), 2])
    );
    this._write(stringToPrint);
  }
  protected _printHiddenLog<T extends any[]>(
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
  }
  protected runTransport<T extends any[]>(logObject: IOReturnType<T, P>): void {
    if (this._transportType === "stdout") {
      if (this._transportProviders.length >= 1) {
        this._transportProviders.forEach((provider): void => {
          if (logObject.defaultLevelRange >= this._logLevels[provider.minLvl]) {
            provider.functions[logObject.levelLog](logObject);
          }
        });
      }
    } else if (this._transportType === "file") {
      if (this._fileTransports.length >= 1) {
        this._fileTransports.forEach((file) => {
          if (
            file.transportProvider.transportLevels.includes(logObject.levelLog)
          ) {
            file.write(logObject);
          }
        });
      }
      return;
    } else {
    }
  }
  protected _handleLog<T extends any[]>(
    type: IOLevelLogId,
    message: IOStd<T>,
    color: typeof ForegroundColor = (chalk.Color = "white"),
    prefix?: string,
    levelRange: IOLevelLog = 0,
    errors: Error[] = []
  ): IOReturnType<T, P> {
    this.emit("willLog", type, message, prefix, levelRange, new Date());
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const prefixName = prefix ?? type.charAt(0).toUpperCase() + type.slice(1);
    const fullPrefix = Helper.getPrefix.apply(this, [
      prefixName,
      this._useOneColor || color,
      loggedAt,
    ]);
    const logObject: IOReturnType<T, P> = this._makeLogObject(
      type,
      message,
      fullPrefix,
      prefixName,
      levelRange,
      this._useOneColor || color
    );
    this.runTransport(logObject);
    try {
      this.emit(
        "logging",
        this._levelLog,
        logObject,
        this._formatString(...logObject.data),
        new Date(),
        logObject.fullPrefix.ToString
      );
      if (!Helper.checkLevel.apply(this, [levelRange])) return logObject;
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
  protected _writePrettyFatal(err: Error): void {
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
    const stackObj = Helper.getErrorStack(undefined, 4);
    return {
      levelLog: type,
      data: message,
      loggedAt: Helper.getLoggedTime(),
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
      defaultLevelRange: type === "prefix" ? 3 : levelRange,
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
      3,
    ]);
  }
  public fatal<T extends object>(
    error: IOErrorParam<T>
  ): IOReturnType<IOReturnError[], P> {
    const ioLogDataError: IOReturnError[] = Helper.getDataError.apply(this, [
      error,
      error.detail,
    ]);
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
      levelLog: opt.levelLog ?? 3,
    };
    return this._handleLog.apply(this, [
      "prefix",
      message,
      opt.color,
      opt.prefix,
      opt.levelLog,
    ]);
  }
  public attachTransport(transport: IOTransportProvider): this {
    this._transportProviders.push(transport);

    return this;
  }
  public attachFileTransport(...transport: TransportFileProvider[]): this {
    this._fileTransports.push(...transport);

    return this;
  }
}
