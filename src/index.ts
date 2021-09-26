import Logger from "./Logger.js";
import {
  LoggerInterface,
  ReturnGetTimeAndType,
  ReturnType,
  IOError,
  IOReturnError,
  levelLogId,
  ErrorReturnType,
} from "./LoggerInterfaces.js";
import { LoggerConsole } from "./LoggerConsole.js";
import { LoggerMethod } from "./LoggerMethod.js";
import { LoggerProperty } from "./LoggerProperty.js";
import { LoggerStatic } from "./LoggerStatic.js";

export default Logger;
export {
  LoggerConsole,
  LoggerStatic,
  LoggerMethod,
  LoggerProperty,
  LoggerInterface,
  ReturnGetTimeAndType,
  ReturnType,
  IOError,
  IOReturnError,
  levelLogId,
  ErrorReturnType,
};
