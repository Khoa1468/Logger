import { ForegroundColor } from "chalk";
import chalk from "chalk";
import ErrorStackParser from "error-stack-parser";
import colorize from "json-colorizer";
import {
  IOErrorParam,
  IOErrorStack,
  IOLevelLog,
  IOReturnError,
  IOReturnGetTimeAndType,
  IOReturnType,
} from "../interfaces/LoggerInterfaces";
import { format } from "util";
import ansiRegex from "ansi-regex";
import fse from "fs-extra";

const parse: (error: Error) => StackFrame[] =
  ErrorStackParser.parse.bind(ErrorStackParser);

interface IFunctionArg {
  getTime: [type: string, color: typeof ForegroundColor, loggedAt: string];
  cleanPath: [path: string | undefined];
  checkLevel: [range: IOLevelLog];
  toJson: [
    data: any,
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    spacing?: number | undefined | string
  ];
}

type ArgWithoutInstance = {
  [key in keyof IFunctionArg]: [...args: IFunctionArg[key]];
};

namespace Helper {
  export function cleanPath(...args: ArgWithoutInstance["cleanPath"]): string {
    if (args["0"] === undefined) return "";
    return args["0"].replace(/file:\/\/\//, "").replace(/%20/g, " ");
  }
  export function getPrefix(
    ...args: ArgWithoutInstance["getTime"]
  ): IOReturnGetTimeAndType {
    const frame = parse(new Error("Genesis Error"))[3];
    const filePath: string = cleanPath(frame.getFileName());
    const lineNumber: number | undefined = frame.getLineNumber();
    const lineColumm: number | undefined = frame.getColumnNumber();
    const prefixString = this._useColor
      ? chalk[args["1"]](
          `[Type: ${args["0"]}, Time: ${
            args["2"]
          }, File: "${filePath}:${lineNumber}:${lineColumm}", PID: ${
            this._pid
          }] ${chalk.whiteBright(`[${chalk.cyanBright(this._cagetoryName)}]`)}`
        )
      : `[Type: ${args["0"]}, Time: ${args["2"]}, File: "${filePath}:${lineNumber}:${lineColumm}", PID: ${this._pid}] [${this._cagetoryName}]`;
    return {
      ToString: prefixString,
    };
  }
  export function checkLevel(
    ...args: ArgWithoutInstance["checkLevel"]
  ): boolean {
    return this._levelLog >= args[0];
  }
  export function getDataError<T extends object>(
    errorList: IOErrorParam<T>,
    detail: object = {}
  ) {
    const returnLogObject: IOReturnError[] = [];
    for (const err of errorList.errors) {
      const stack = parse(err);
      returnLogObject.push({
        defaultError: err,
        nativeError: err.stack!,
        detail,
        user: this._hostname,
        isError: true,
        ...getErrorStack(stack),
      });
    }
    return returnLogObject;
  }
  export function getErrorStack(
    stack?: StackFrame[] | undefined,
    range: number = 3
  ): IOErrorStack {
    if (stack) {
      return {
        filePath: Helper.cleanPath(stack[0].getFileName()),
        fullFilePath: stack[0].getFileName(),
        lineNumber: stack[0].getLineNumber(),
        lineColumm: stack[0].getColumnNumber(),
        methodName: stack[0].getFunctionName(),
        functionName: stack[0].getFunctionName(),
        isConstructor: stack[0].getIsConstructor(),
      };
    } else {
      const localStack = parse(new Error("Genesis Error"));
      return {
        filePath: Helper.cleanPath(localStack[range].getFileName()),
        fullFilePath: localStack[range].getFileName(),
        lineNumber: localStack[range].getLineNumber(),
        lineColumm: localStack[range].getColumnNumber(),
        methodName: localStack[range].getFunctionName(),
        functionName: localStack[range].getFunctionName(),
        isConstructor: localStack[range].getIsConstructor(),
      };
    }
  }
  export function toJson(...args: ArgWithoutInstance["toJson"]): string {
    return colorize(JSON.stringify(args[0], args[1], args[2]), {
      pretty: true,
      colors: {
        STRING_KEY: "cyanBright",
        STRING_LITERAL: "redBright",
        NUMBER_LITERAL: "greenBright",
        BOOLEAN_LITERAL: "yellowBright",
        NULL_LITERAL: "grey",
      },
    });
  }
  export function getLoggedTime(): string {
    return `${
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    }`;
  }
  export function censor(censor: any) {
    var i = 0;
    return function (key: string, value: any) {
      if (
        i !== 0 &&
        typeof censor === "object" &&
        typeof value == "object" &&
        censor == value
      )
        return "[Circular]";
      ++i;
      return value;
    };
  }
  export function generateDataString(logObject: IOReturnType<any[], any>) {
    let data = "";
    if (logObject.levelLog === "fatal") {
      const newLogObject = logObject as IOReturnType<IOReturnError[], any>;
      let errorString = "";
      newLogObject.data.forEach((val) => {
        errorString += `${
          val.defaultError.stack?.split("\n")[0].trim() ||
          `${val.defaultError.name}: ${val.defaultError.message}`
        } ${val.defaultError.stack?.split("\n")[1].trim()};`;
      });

      data += format.apply(null, [
        newLogObject.fullPrefix.ToString,
        `[${errorString}]`,
      ]) as string;
    } else {
      data += format.apply(null, [
        logObject.fullPrefix.ToString,
        ...logObject.data,
      ]) as string;
    }

    return data.replace(ansiRegex(), "");
  }
  export function consoleVerbose(logObject: IOReturnType<any[], any>) {
    process.stdout.write(
      format.apply(null, [
        "Verbose log:\n",
        "Your path:",
        this.transportProvider.filePath,
        "\n",
        "Real path:",
        fse.realpathSync(this.transportProvider.filePath),
        "\n",
        "Path exists:",
        fse.existsSync(this.transportProvider.filePath),
        "\n",
        "Logging level:",
        logObject.levelLog,
        "\n",
        "Logger name:",
        logObject.instanceName,
        "\n",
      ])
    );
  }
}

export { Helper };
