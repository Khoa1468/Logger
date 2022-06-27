import { hostname } from "os";
import {
  IOLoggerInterface,
  IOOnloadInterface,
  IOLevelLog,
  ChildLogger,
  IOChildLoggerProperty,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";

const VERSION_STR = "1.6.10";
/**
 * This Is My Logger
 */

export class Logger<P extends {}, OP extends {} = {}> extends LoggerUtils<P> {
  private _isChild: boolean = false;
  private _parentName: string = "";
  public parentOldProps: Readonly<OP> = {} as Readonly<OP>;
  public get isChild(): boolean {
    return this._isChild;
  }
  public get parentName(): string {
    return this._parentName;
  }
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
    onInit: IOOnloadInterface<P> = (Logger) => {}
  ) {
    super(
      {
        instanceName,
        cagetoryName,
        format,
        short,
        levelLog,
        useColor,
      },
      {} as P
    );
    onInit(this);
  }
  public static create<P extends {} = {}>(
    {
      instanceName = hostname(),
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = IOLevelLog.NONE,
      useColor = true,
    }: IOLoggerInterface,
    onInit: IOOnloadInterface<P> = (Logger) => {}
  ) {
    return new Logger(
      {
        instanceName,
        cagetoryName,
        format,
        short,
        levelLog,
        useColor,
      },
      onInit
    );
  }
  public static get VERSION(): string {
    return VERSION_STR;
  }
  public get VERSION(): string {
    return VERSION_STR;
  }
  public child<T extends {}, LP extends {} = {}>(
    bindingOpt?: T,
    loggerOpt?: LP,
    childSetting: IOLoggerInterface = this.listSetting()
  ): ChildLogger<P, T, LP> {
    const childLogger: Logger<P & T, P> = new Logger<P & T, P>({
      ...this.listSetting(),
      ...childSetting,
    });

    const loggerProps = Object.freeze({
      loggerProps: Object.freeze(loggerOpt),
    } as IOChildLoggerProperty<LP>);

    let bindingLoggerProps = Object.assign(childLogger, loggerProps);

    bindingLoggerProps._isChild = true;
    bindingLoggerProps.childProps = {
      ...this.childProps,
      ...(bindingOpt ?? ({} as T)),
    };
    bindingLoggerProps._parentName = this.loggerName;
    bindingLoggerProps.parentOldProps = this.getBindingOpt();

    this.emit(
      "childCreated",
      this,
      bindingLoggerProps,
      childSetting,
      childSetting.instanceName || this.listSetting().instanceName || "",
      Object.freeze(bindingOpt!),
      loggerProps
    );
    return bindingLoggerProps;
  }
}
