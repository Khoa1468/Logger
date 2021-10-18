import { hostname } from "os";
import { IOLoggerInterface } from "./LoggerInterfaces.js";
import { LoggerStatic } from "./LoggerStatic.js";

/**
 * This Is My Logger
 */

export default class Logger extends LoggerStatic {
  public static create({
    instanceName = hostname(),
    isLoggedAt = true,
    isType = true,
    isDisplayRootFile = true,
    cagetoryName = instanceName,
    format = "hidden",
    short = false,
    levelLog = [0],
  }: IOLoggerInterface) {
    return new Logger({
      instanceName,
      isLoggedAt,
      isType,
      isDisplayRootFile,
      cagetoryName,
      format,
      short,
      levelLog,
    });
  }
}
