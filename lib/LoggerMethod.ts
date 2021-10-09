import { parse, StackFrame } from "stack-trace";
import chalk from "chalk";
import {
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOErrorParam,
  IOSetting,
  IOStd,
  IOReturnError,
  IOErrorStack,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";

export class LoggerMethod extends LoggerUtils {
  protected handleLog(
    type: IOLevelLogId,
    message: IOStd[],
    typeTime: "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
    color: string = (chalk.Color = "white")
  ): IOReturnType {
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      typeTime,
      color
    );
    const ioLogObject: IOReturnType = this.returnTypeFunction(
      type,
      message,
      this.getErrorStack(),
      this.listSetting()
    );
    this.allLoggerObj.push(ioLogObject);
    if (type !== "fatal") {
      if (this.format === "pretty") {
        console[type](
          `${
            this.short
              ? ""
              : `${
                  message ? `${chalk.keyword(color)(timeAndType.ToString)}` : ""
                }`
          }`,
          ...message
        );
      } else if (this.format === "json") {
        console[type](
          `${
            this.short
              ? ""
              : `${
                  message ? `${chalk.keyword(color)(timeAndType.ToString)}` : ""
                }`
          }`,
          this.toJson(ioLogObject)
        );
        return ioLogObject;
      } else if (this.format === "hidden") {
        return ioLogObject;
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
      const stack: StackFrame[] = parse(err);
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
  ): IOReturnType {
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      "Fatal",
      (chalk.Color = "magenta")
    );
    try {
      const ioLogDataError: IOReturnError[] = this.getDataError(
        errorList,
        errorList.detail
      );
      const ioLogObject: IOReturnType = this.returnFatalTypeFunction(
        this.getErrorStack(),
        ioLogDataError,
        this.listSetting()
      );
      this.allLoggerObj.push(ioLogObject);
      if (this.format === "pretty") {
        console.error(
          `${
            this.short
              ? ""
              : `${
                  errorList
                    ? `${chalk.keyword("magenta")(
                        timeAndType.ToString
                      )}\n--------------------------------------------------------------------------`
                    : ""
                }`
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
            this.short
              ? ""
              : `${
                  errorList
                    ? `${chalk.keyword("magenta")(timeAndType.ToString)}`
                    : ""
                }`
          }`,
          this.toJson(ioLogObject)
        );
        return ioLogObject;
      } else if (this.format === "hidden") {
        return ioLogObject;
      }
      return ioLogObject;
    } catch (err: any) {
      this.handleLogFatal({ errors: [err] });
      return err;
    }
  }

  protected returnTypeFunction(
    type: IOLevelLogId,
    message: unknown[],
    stack: IOErrorStack,
    setting?: IOSetting
  ): IOReturnType {
    return {
      levelLog: type,
      data: message,
      loggedAt: `${this.loggedAt}`,
      hostName: this.hostname,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
      ...stack,
      setting,
      toJson() {
        return JSON.stringify(this);
      },
    };
  }

  protected returnFatalTypeFunction(
    stack: IOErrorStack,
    dataError: IOReturnError[],
    setting?: IOSetting
  ): IOReturnType {
    return {
      levelLog: "fatal",
      data: dataError,
      loggedAt: `${this.loggedAt}`,
      hostName: this.hostname,
      instanceName: this.loggerName,
      cagetory: this.cagetoryName,
      ...stack,
      setting,
      toJson() {
        return JSON.stringify(this);
      },
    };
  }
}
