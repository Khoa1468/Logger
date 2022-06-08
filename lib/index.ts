import { Logger } from "./Logger.js";
import { hostname } from "os";
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
  SubscribeInterface,
} from "./LoggerInterfaces.js";

function getLogger(
  opts?: IOLoggerInterface,
  onInit: IOOnloadInterface = (Logger) => {}
): Logger {
  const instanceName = opts?.instanceName || hostname();
  return new Logger(
    opts != null
      ? opts
      : {
          instanceName,
          isLoggedAt: true,
          isType: true,
          isDisplayRootFile: true,
          cagetoryName: instanceName,
          format: "hidden",
          short: false,
          levelLog: [0],
        },
    onInit
  );
}

export {
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
  Logger,
  SubscribeInterface,
  getLogger,
};
