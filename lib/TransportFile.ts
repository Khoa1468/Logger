import fse from "fs-extra";
import { IOFileTransportProvider, IOReturnType } from "./LoggerInterfaces.js";
import { format } from "util";
import { Helper } from "./HelperFunctions.js";

export class TransportFileProvider {
  private init = true;
  constructor(public transportProvider: IOFileTransportProvider) {}
  public write(logObject: IOReturnType<any[], any>): void {
    if (fse.existsSync(this.transportProvider.filePath)) {
      let data = Helper.generateDataString(logObject);
      if (this.transportProvider.verbose) {
        process.stdout.write(
          format.apply(null, [
            "Verbose log:\n",
            "Your path:",
            this.transportProvider.filePath,
            "\n",
            "Real path:",
            fse.realpathSync(this.transportProvider.filePath),
            "\n",
            "Path Exists:",
            fse.existsSync(this.transportProvider.filePath),
            "\n",
          ])
        );
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
