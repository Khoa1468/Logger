import { Logger } from "./Logger.js";
import { hostname } from "os";
import {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOBaseReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
  IOSetting,
  IOErrorStack,
  IOStd,
  IOLevelLog,
  IOOnloadInterface,
  IOLevelLogList,
  IOReturnType,
} from "./LoggerInterfaces.js";

function getLogger<P extends {}>(
  opts?: IOLoggerInterface,
  bindingOpt: P = {} as P
): Logger<P> {
  const instanceName = opts?.instanceName || hostname();
  return new Logger(
    opts != null
      ? opts
      : {
          cagetoryName: instanceName,
          format: "hidden",
          short: false,
          levelLog: [0],
          useColor: true,
        },
    bindingOpt
  );
}

export {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOBaseReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
  IOSetting,
  IOErrorStack,
  IOStd,
  IOLevelLog,
  IOOnloadInterface,
  Logger,
  IOLevelLogList,
  IOReturnType,
  getLogger,
};
