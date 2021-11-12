import { hostname } from "os";
import { IOLoggerInterface, IOOnloadInterface } from "./LoggerInterfaces.js";
import { LoggerStatic } from "./LoggerStatic.js";

/**
 * This Is My Logger
 */

export default class Logger extends LoggerStatic {
  constructor(
    {
      instanceName = hostname(),
      isLoggedAt = true,
      isType = true,
      isDisplayRootFile = true,
      cagetoryName = instanceName,
      format = "hidden",
      short = false,
      levelLog = [0],
    }: IOLoggerInterface,
    onload: IOOnloadInterface = (Logger) => {}
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
    onload(Logger);
    this.onload = onload;
  }
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
