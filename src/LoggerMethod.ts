import { parse } from "stack-trace";
import chalk from "chalk";
import {
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOError,
  IOErrorParam,
  IOSetting,
  IOErrorStack,
  IOStd,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";

export class LoggerMethod extends LoggerUtils {
  protected handleLog(
    type: IOLevelLogId,
    message: IOStd[],
    typeTime: "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
    color: string = (chalk.Color = "white")
  ): IOReturnType {
    const timeAndType = this.getTimeAndType(typeTime, color);
    if (type !== "fatal") {
      console[type](
        `${message ? `${chalk.keyword(color)(timeAndType.ToString)}` : ""}`,
        ...message
      );
    }

    return this.returnTypeFunction(
      type,
      timeAndType,
      message,
      this.listSetting()
    );
  }

  protected handleLogFatal<T extends object>(
    errorList: IOErrorParam<T>
  ): IOReturnType {
    const timeAndType = this.getTimeAndType("Fatal", (chalk.Color = "magenta"));
    try {
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
        return err;
      });
      console.error(
        `--------------------------------------------------------------------------`
      );
      const stack = parse(errorList.errors[0]);
      return this.returnFatalTypeFunction(
        timeAndType,
        errorList.errors,
        errorList.detail,
        this.getErrorStack(stack),
        this.listSetting()
      );
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
    errors: IOError[],
    detailError: object = {},
    errorStack: IOErrorStack,
    setting?: IOSetting
  ): IOReturnType {
    return {
      levelLog: "fatal",
      data: {
        nativeError: errors,
        detail: detailError,
        user: this.loggerName,
        isError: true,
        ...errorStack,
      },
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
