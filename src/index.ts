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

const logger: Logger = new Logger({});

logger.log("This is a Logger Example");

logger.setSettings({
  isDisplayRootFile: false,
  isLoggedAt: false,
  isType: false,
});

logger.log(
  "Source Code: https://github.com/Khoa1468/Logger\nGithub: https://github.com/Khoa1468/"
);
