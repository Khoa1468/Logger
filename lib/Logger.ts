import { hostname } from "os";
import {
  IOLoggerInterface,
  IOOnloadInterface,
  IOLevelLog,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";

const VERSION_STR = "1.6.9";
/**
 * This Is My Logger
 */

export class Logger<P extends {}> extends LoggerUtils<P> {
  /**
   * This Is My Logger
   */
  constructor({
    instanceName = hostname(),
    cagetoryName = instanceName,
    format = "hidden",
    short = false,
    levelLog = [IOLevelLog.NONE],
    useColor = true,
  }: IOLoggerInterface) {
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
  }
  public static create<P extends {} = {}>(
    {
      instanceName = hostname(),
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = [IOLevelLog.NONE],
      useColor = true,
    }: IOLoggerInterface,
    onInit: IOOnloadInterface = (Logger) => {},
    bindingOpt: P = {} as P
  ) {
    return new Logger({
      instanceName,
      cagetoryName,
      format,
      short,
      levelLog,
      useColor,
    });
  }
  public static get VERSION(): string {
    return VERSION_STR;
  }
  public get VERSION(): string {
    return VERSION_STR;
  }
}

export class ChildClass<P extends {}> extends Logger<P> {
  constructor(
    {
      instanceName = hostname(),
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = [IOLevelLog.NONE],
      useColor = true,
    }: IOLoggerInterface,
    bindingOpts: P = {} as P
  ) {
    super({
      instanceName,
      cagetoryName,
      format,
      short,
      levelLog,
      useColor,
    });
    this.childProps = bindingOpts;
  }
}
