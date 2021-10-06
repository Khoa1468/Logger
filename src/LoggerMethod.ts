import { parse } from "stack-trace";
import chalk from "chalk";
import {
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOErrorParam,
  IOSetting,
  IOStd,
  IOReturnError,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";

export class LoggerMethod extends LoggerUtils {
  protected handleLog(
    type: IOLevelLogId,
    message: IOStd[],
    typeTime: "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
    color: string = (chalk.Color = "white")
  ): IOReturnType | undefined {
    const timeAndType = this.getTimeAndType(typeTime, color);
    const ioLogObject = this.returnTypeFunction(
      type,
      timeAndType,
      message,
      this.listSetting()
    );
    this.allLoggerObj.push(ioLogObject);
    if (type !== "fatal") {
      if (this.format === "pretty") {
        console[type](
          `${message ? `${chalk.keyword(color)(timeAndType.ToString)}` : ""}`,
          ...message
        );
      } else if (this.format === "json") {
        console[type](
          `${message ? `${chalk.keyword(color)(timeAndType.ToString)}` : ""}`,
          this.toJson(ioLogObject)
        );
      } else if (this.format === "hidden") {
        return;
      }
    }

    return ioLogObject;
  }

  protected getDataError<T extends object>(
    errorList: IOErrorParam<T>,
    detail: object = {}
  ): IOReturnError[] {
    const returnLogObject: IOReturnError[] = [];
    errorList.errors.map((err: Error) => {
      const stack = parse(err);
      returnLogObject.push({
        nativeError: err,
        detail,
        user: this.hostname,
        isError: true,
        ...this.getErrorStack(stack),
      });
    });
    return returnLogObject;
  }

  protected handleLogFatal<T extends object>(
    errorList: IOErrorParam<T>
  ): IOReturnType | undefined {
    const timeAndType = this.getTimeAndType("Fatal", (chalk.Color = "magenta"));
    try {
      const ioLogDataError = this.getDataError(errorList, errorList.detail);
      const ioLogObject = this.returnFatalTypeFunction(
        timeAndType,
        ioLogDataError,
        this.listSetting()
      );
      this.allLoggerObj.push(ioLogObject);
      if (this.format === "pretty") {
        console.error(
          `${
            errorList
              ? `${chalk.keyword("magenta")(
                  timeAndType.ToString
                )}\n--------------------------------------------------------------------------`
              : ""
          }`
        );
        errorList.errors.forEach((err: Error) => {
          console.error("", "Message:", chalk.redBright(err.message), "\n");
          console.error(
            "",
            `============================================== \n`,
            ""
          );
          console.error("", `${chalk.bgRed("STACK:")} \n`, "");
          console.error(
            "",
            chalk.yellow(err.stack?.replace(/at /g, `${chalk.red("• ")}`)),
            "\n"
          );
          if (errorList.errors.length >= 2) {
            console.error(
              `--------------------------------------------------------------------------`
            );
          } else {
            false;
          }
          return err;
        });
        if (errorList.errors.length < 2) {
          console.error(
            `--------------------------------------------------------------------------`
          );
        } else {
          false;
        }
      } else if (this.format === "json") {
        console.error(
          `${
            errorList ? `${chalk.keyword("magenta")(timeAndType.ToString)}` : ""
          }`,
          this.toJson(ioLogObject)
        );
      } else if (this.format === "hidden") {
        // console.error();
        return;
      }
      return ioLogObject;
    } catch (err: any) {
      this.handleLogFatal({ errors: [err] });
      return err;
    }
  }

  protected returnTypeFunction(
    type: IOLevelLogId,
    objToReturn: IOReturnGetTimeAndType,
    message: unknown[],
    setting?: IOSetting
  ): IOReturnType {
    return {
      levelLog: type,
      data: message,
      loggedAt: `${this.loggedAt}`,
      filePath: objToReturn.filePath,
      fullFilePath: objToReturn.fullFilePath,
      lineNumber: objToReturn.lineNumber,
      hostName: this.hostname,
      lineColumm: objToReturn.lineColumm,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
      setting,
    };
  }

  protected returnFatalTypeFunction(
    objToReturn: IOReturnGetTimeAndType,
    dataError: IOReturnError[],
    setting?: IOSetting
  ): IOReturnType {
    return {
      levelLog: "fatal",
      data: dataError,
      loggedAt: `${this.loggedAt}`,
      hostName: this.hostname,
      filePath: objToReturn.filePath,
      fullFilePath: objToReturn.fullFilePath,
      lineNumber: objToReturn.lineNumber,
      lineColumm: objToReturn.lineColumm,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
      setting,
    };
  }
}
