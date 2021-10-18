import { hostname } from "os";
import {
  IOLevelLog,
  IOLoggerInterface,
  IOReturnType,
} from "./LoggerInterfaces.js";

const date = new Date();

export class LoggerProperty {
  protected name: string = "";
  readonly loggedAt: string = `${
    date.toLocaleTimeString() + " " + date.toLocaleDateString()
  }`;
  protected isLoggedAt: boolean = true;
  protected isType: boolean = true;
  protected isDisplayRootFile: boolean = true;
  protected cagetoryName: string = "";
  protected hostname = hostname();
  protected format: "hidden" | "json" | "pretty" = "hidden";
  protected allLoggerObj: IOReturnType[] = [];
  protected short: boolean = false;
  protected levelLog: IOLevelLog = [0];
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
