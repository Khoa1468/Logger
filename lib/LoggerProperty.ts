import { hostname } from "os";
import {
  IOLevelLog,
  IOLoggerInterface,
  IOReturnType,
} from "./LoggerInterfaces.js";

export class LoggerProperty {
  protected name: string = "";
  protected isLoggedAt: boolean = true;
  protected isType: boolean = true;
  protected isDisplayRootFile: boolean = true;
  protected cagetoryName: string = "";
  protected hostname = hostname();
  protected format: "hidden" | "json" | "pretty" = "hidden";
  protected short: boolean = false;
  protected levelLog: IOLevelLog = [0];
  protected allLogObj: Array<IOReturnType<any[]>> = [];
  /**
   * This Is My Logger
   */
  constructor({
    instanceName = hostname(),
    isLoggedAt = true,
    isType = true,
    isDisplayRootFile = true,
    cagetoryName = instanceName,
    format = "hidden",
    short = false,
    levelLog = [0],
  }: IOLoggerInterface) {
    this.name = instanceName;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
    this.cagetoryName = cagetoryName;
    this.format = format;
    this.short = short;
    this.levelLog = levelLog;
  }
}
