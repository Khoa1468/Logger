import { Logger as LoggerClass } from "./Logger.js";

interface IOLoggerInterface {
  instanceName?: string;
  isLoggedAt?: boolean;
  isType?: boolean;
  isDisplayRootFile?: boolean;
  cagetoryName?: string;
  format?: "json" | "pretty" | "hidden";
  short?: boolean;
  levelLog?: IOLevelLog;
}

interface IOSetting extends IOLoggerInterface {
  hostName: string;
}

interface IOAllLogObj {
  total: number;
  allLogObj: {
    data: IOReturnType<any[]>[];
  };
  toJson: string;
}

interface IOOnloadInterface {
  (Logger: typeof LoggerClass): void;
}

interface IOReturnGetTimeAndType {
  ToString: string;
  filePath: string;
  lineNumber: number | null;
  lineColumm: number | null;
  fullFilePath: string | null;
}

type IOStd<T extends any[]> = T;

interface IOErrorStack {
  filePath: string;
  fullFilePath: string | null;
  lineNumber: number | null;
  lineColumm: number | null;
  functionName: string;
  methodName: string;
  isConstructor: boolean;
  typeName: string;
}

interface IOReturnError extends IOErrorStack {
  nativeError: IOError;
  detail: object | undefined;
  user: string;
  isError: true;
}

type IOLevelLogId = "log" | "warn" | "info" | "error" | "fatal" | "debug";

type IOArgumentData<T extends any[] = []> = T;

interface IOReturnType<T extends any[] = []> extends IOErrorStack {
  levelLog: IOLevelLogId;
  data: IOArgumentData<T>;
  loggedAt: string;
  hostName: string;
  instanceName: string;
  cagetory: string;
  setting?: IOSetting;
  toJson: () => string;
}

interface IOErrorParam<T> {
  errors: IOError[];
  detail?: T;
}

type IOError = Error | any;

type IOLevelLog = (0 | 1 | 2 | 3 | 4 | 5)[];

interface SubscribeInterface {
  subscribe: () => string;
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
  SubscribeInterface,
};
