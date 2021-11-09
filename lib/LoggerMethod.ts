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
  protected handleLog<T extends any[]>(
    type: IOLevelLogId,
    message: IOStd<T>,
    typeTime: "Log" | "Error" | "Info" | "Warn" | "Fatal" | "Debug",
    color: string = (chalk.Color = "white")
  ): IOReturnType<T> {
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      typeTime,
      color,
      loggedAt
    );
    const ioLogObject: IOReturnType<T> = this.returnTypeFunction(
      type,
      message,
      this.getErrorStack(),
      loggedAt,
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
    const loggedAt = `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
    const timeAndType: IOReturnGetTimeAndType = this.getTimeAndType(
      "Fatal",
      (chalk.Color = "magenta"),
      loggedAt
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
          loggedAt,
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
    loggedAt: string,
    setting?: IOSetting
  ): IOReturnType<T> {
    return {
      levelLog: type,
      data: message,
      loggedAt: loggedAt,
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
    loggedAt: string,
    setting?: IOSetting
  ): IOReturnType<IOReturnError[]> {
    return {
      levelLog: "fatal",
      data: dataError,
      loggedAt: loggedAt,
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
  public toJson<T extends any[]>(
    data: IOReturnType<T>
  ): string | undefined | IOReturnType<IOReturnError[]> {
    try {
      return JSON.stringify(data);
    } catch (error) {
      if (error instanceof Error) {
        const oldFormat = this.format;
        this.format = "pretty";
        const errorDetail = this.handleLogFatal({ errors: [error] });
        this.format = oldFormat;
        return errorDetail;
      }
    }
  }
  public toPretty<T extends any[]>(data: string): IOReturnType<T> {
    return JSON.parse(data);
  }
}
