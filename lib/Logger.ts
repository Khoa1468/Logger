import { hostname } from "os";
import {
  IOLoggerInterface,
  IOOnloadInterface,
  IOLevelLog,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";
import { SubscribeInterface } from "./LoggerInterfaces.js";

const VERSION_STR = "1.6.7 pre-alpha";
/**
 * This Is My Logger
 */

export class Logger extends LoggerUtils {
  /**
   * This Is My Logger
   */
  constructor(
    {
      instanceName = hostname(),
      isLoggedAt = true,
      isType = true,
      isDisplayRootFile = true,
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = [IOLevelLog.NONE],
    }: IOLoggerInterface,
    onInit: IOOnloadInterface = (Logger) => {}
  ) {
    super({
      instanceName,
      isLoggedAt,
      isType,
      isDisplayRootFile,
      cagetoryName,
      format,
      short,
      levelLog,
    });
    onInit(Logger);
    this.onInit = onInit;
  }
  public static create(
    {
      instanceName = hostname(),
      isLoggedAt = true,
      isType = true,
      isDisplayRootFile = true,
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = [IOLevelLog.NONE],
    }: IOLoggerInterface,
    onInit: IOOnloadInterface = (Logger) => {}
  ) {
    return new Logger(
      {
        instanceName,
        isLoggedAt,
        isType,
        isDisplayRootFile,
        cagetoryName,
        format,
        short,
        levelLog,
      },
      onInit
    );
  }
  public static thankYou(): SubscribeInterface {
    console.log("Thank You For Using This Logger");
    return {
      subscribe(): string {
        return "Please follow my github: https://github.com/Khoa1468/";
      },
    };
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
