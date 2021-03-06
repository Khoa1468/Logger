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
  IOKeyEvents,
  IOTransportProvider,
  IOFileTransportProvider,
} from "./LoggerInterfaces.js";
import { Helper } from "./HelperFunctions.js";
import { TransportFileProvider } from "./TransportFile.js";

const toJson: (
  data: any,
  replacer?: ((this: any, key: string, value: any) => any) | undefined,
  spacing?: string | number | undefined
) => string = Helper.toJson;

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
          instanceName,
          transportType: "none",
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
  IOKeyEvents,
  IOTransportProvider,
  IOFileTransportProvider,
  TransportFileProvider,
  getLogger,
  useExpressLogger,
  toJson,
};
