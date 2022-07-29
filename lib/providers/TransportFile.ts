import fse from "fs-extra";
import {
  IOFileTransportProvider,
  IOReturnType,
} from "../interfaces/LoggerInterfaces.js";
import { Helper } from "../helper/HelperFunctions.js";

export class TransportFileProvider {
  private init = true;
  constructor(public transportProvider: IOFileTransportProvider) {}
  public write(logObject: IOReturnType<any[], any>): void {
    if (fse.existsSync(this.transportProvider.filePath)) {
      let data = Helper.generateDataString(logObject);
      if (this.transportProvider.verbose) {
        Helper.consoleVerbose.call(this, logObject);
      }
      data += `${this.transportProvider.newLine ? "\n" : ";"}`;
      if (this.init) {
        this.init = false;
        if (this.transportProvider.initAndRewriteWhenStart) {
          const initData = this.transportProvider.initData || "";
          fse.appendFileSync(this.transportProvider.filePath, initData);
        } else {
          if (!fse.readFileSync(this.transportProvider.filePath).toString()) {
            const initData = this.transportProvider.initData || "";
            fse.appendFileSync(this.transportProvider.filePath, initData);
          }
        }
      }
      fse.appendFileSync(this.transportProvider.filePath, data);
      return;
    }
    fse.createFileSync(this.transportProvider.filePath);
    this.write(logObject);
  }
}
