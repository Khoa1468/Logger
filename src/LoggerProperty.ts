import { hostname } from "os";
import { IOLoggerInterface } from "./LoggerInterfaces.js";

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
  /**
   * This Is My Logger
   */
  constructor({
    name = hostname(),
    isLoggedAt = true,
    isType = true,
    isDisplayRootFile = true,
    cagetoryName = name,
  }: IOLoggerInterface) {
    this.name = name;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
    this.cagetoryName = cagetoryName;
  }
}
