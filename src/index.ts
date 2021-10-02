import Logger from "./Logger.js";
import {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
  IOSetting,
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
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
  IOSetting,
};
