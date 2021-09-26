import { hostname } from "os";
import { LoggerInterface } from "./LoggerInterfaces.js";

const date = new Date();

export class LoggerProperty {
  protected name: string = "";
  readonly loggedAt: string = `${
    date.toLocaleTimeString() + " " + date.toLocaleDateString()
  }`;
  protected isLoggedAt: boolean = true;
  protected isType: boolean = true;
  protected isDisplayRootFile: boolean = true;
  /**
   * This Is My Logger
   */
  constructor({
    name = hostname(),
    isLoggedAt = true,
    isType = true,
    isDisplayRootFile = true,
  }: LoggerInterface) {
    this.name = name;
    this.isLoggedAt = isLoggedAt;
    this.isType = isType;
    this.isDisplayRootFile = isDisplayRootFile;
  }
}
