import { hostname } from "os";
import {
  IOLoggerInterface,
  IOOnloadInterface,
  IOLevelLog,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";

const VERSION_STR = "1.6.8-lastest";
/**
 * This Is My Logger
 */

export class Logger<P extends {}> extends LoggerUtils<P> {
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
    bindingOpt: P = {} as P
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
      bindingOpt
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
    return new Logger(
      {
        instanceName,
        cagetoryName,
        format,
        short,
        levelLog,
        useColor,
      },
      bindingOpt
    );
  }
  public static get VERSION(): string {
    return VERSION_STR;
  }
  public get VERSION(): string {
    return VERSION_STR;
  }
}
