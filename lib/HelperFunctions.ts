import { LoggerUtils } from "./LoggerUtils";
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
} from "./LoggerInterfaces";

const parse: (error: Error) => StackFrame[] =
  ErrorStackParser.parse.bind(ErrorStackParser);

interface IDefaultArg {
  default: [instance: LoggerUtils<any>];
}

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
}

export { Helper };
