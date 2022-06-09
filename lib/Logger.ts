import { hostname } from "os";
import {
  IOLoggerInterface,
  IOOnloadInterface,
  IOLevelLog,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";

const VERSION_STR = "1.6.8";
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
    }: IOLoggerInterface,
    onInit: IOOnloadInterface = (Logger) => {},
    childOpt: P = {} as P
  ) {
    super(
      {
        instanceName,
        cagetoryName,
        format,
        short,
        levelLog,
      },
      childOpt
    );
    onInit(Logger);
    this.onInit = onInit;
  }
  public static create<P extends {} = {}>(
    {
      instanceName = hostname(),
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = [IOLevelLog.NONE],
    }: IOLoggerInterface,
    onInit: IOOnloadInterface = (Logger) => {},
    childOpt: P = {} as P
  ) {
    return new Logger(
      {
        instanceName,
        cagetoryName,
        format,
        short,
        levelLog,
      },
      onInit,
      childOpt
    );
  }
  public static get VERSION(): string {
    return VERSION_STR;
  }
  public get VERSION(): string {
    return VERSION_STR;
  }
  public static isProd(env: string = "LOGGER_ENV"): boolean {
    const envValue = env in process.env;
    const getFromProcess =
      Number.parseInt(process.env[env]!, 10) === 1 ||
      process.env[env] === "production" ||
      process.env[env] === "prod";
    return envValue ? getFromProcess : false;
  }
  public isProd(env: string = "LOGGER_ENV"): boolean {
    const envValue = env in process.env;
    const getFromProcess =
      Number.parseInt(process.env[env]!, 10) === 1 ||
      process.env[env] === "production" ||
      process.env[env] === "prod";
    return envValue ? getFromProcess : false;
  }
}
