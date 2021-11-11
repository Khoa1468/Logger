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
  IOErrorStack,
  IOStd,
  IOAllLogObj,
  IOLevelLog,
  IOArgumentData,
  IOOnloadInterface,
} from "./LoggerInterfaces.js";
import { LoggerConsole } from "./LoggerConsole.js";
import { LoggerMethod } from "./LoggerMethod.js";
import { LoggerProperty } from "./LoggerProperty.js";
import { LoggerStatic } from "./LoggerStatic.js";
import { LoggerUtils } from "./LoggerUtils.js";

export default Logger;
export {
  LoggerConsole,
  LoggerStatic,
  LoggerMethod,
  LoggerProperty,
  LoggerUtils,
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
  IOSetting,
  IOErrorStack,
  IOStd,
  IOAllLogObj,
  IOLevelLog,
  IOArgumentData,
  IOOnloadInterface,
};
