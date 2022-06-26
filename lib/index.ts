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
  onInit: IOOnloadInterface<P> = (Logger) => {}
): Logger<P> {
  const instanceName = opts?.instanceName || hostname();
  return new Logger(
    opts != null
      ? opts
      : {
          cagetoryName: instanceName,
          format: "hidden",
          short: false,
          levelLog: IOLevelLog.NONE,
          useColor: true,
        },
    onInit
  );
}

function useExpressLogger<P extends {}>(
  logger: Logger<P>,
  opts: IOLoggerInterface = {}
) {
  logger.setSettings(opts);

  return async (req: any, res: any, next: any) => {
    const start = Date.now();
    next();
    const ms = Date.now() - start;
    const date = new Date().toLocaleString();
    logger.info(
      `[${date}] ${req.hostname} ${req.ip} - ${req.protocol.toUpperCase()} ${
        req.method
      } ${req.originalUrl} - ${ms}ms - ${req.headers["user-agent"]} - ${
        res.statusCode
      }`
    );
  };
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
  useExpressLogger,
};
