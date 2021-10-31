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
  IOAllLogObj,
} from "./LoggerInterfaces.js";
import { LoggerUtils } from "./LoggerUtils.js";

export class LoggerMethod extends LoggerUtils {
  protected handleLog<T extends any[]>(
    type: IOLevelLogId,
    message: IOStd<T>,
    typeTime: "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
    color: string = (chalk.Color = "white")
  ): IOReturnType<T> {
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      typeTime,
      color
    );
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      type,
      message,
      this.getErrorStack(),
      this.listSetting()
    );
    this.allLogObj.push(ioLogObject);
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
  ): IOReturnType<IOReturnError[]> {
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      "Fatal",
      (chalk.Color = "magenta")
    );
    try {
      const ioLogDataError: IOReturnError[] = this.getDataError(
        errorList,
        errorList.detail
      );
      const ioLogObject: IOReturnType<IOReturnError[]> =
        this.returnFatalTypeFunction(
          this.getErrorStack(),
          ioLogDataError,
          this.listSetting()
        );
      this.allLogObj.push(ioLogObject);
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

  protected returnTypeFunction<T extends any[]>(
    type: IOLevelLogId,
    message: T,
    stack: IOErrorStack,
    setting?: IOSetting
  ): IOReturnType<T> {
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
  ): IOReturnType<IOReturnError[]> {
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
