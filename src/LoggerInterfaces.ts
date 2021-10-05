interface IOLoggerInterface {
  instanceName?: string;
  isLoggedAt?: boolean;
  isType?: boolean;
  isDisplayRootFile?: boolean;
  cagetoryName?: string;
  format?: "json" | "pretty" | "hidden";
}

interface IOSetting extends IOLoggerInterface {
  hostName: string;
}

interface IOReturnGetTimeAndType {
  ToString: string;
  filePath: string;
  lineNumber: number | null;
  lineColumm: number | null;
  fullFilePath: string | null;
}

type IOStd = unknown;

interface IOErrorStack {
  filePath: string;
  fullFilePath: string | null;
  lineNumber: number | null;
  lineColumm: number | null;
  functionName: string;
  methodName: string;
  isClass: boolean;
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

interface IOReturnType {
  levelLog: IOLevelLogId;
  data: (IOReturnError | unknown)[];
  loggedAt: string;
  filePath: string;
  hostName: string;
  fullFilePath: string | null;
  lineNumber: number | null;
  lineColumm: number | null;
  instanceName: string;
  cagetory: string;
  setting?: IOSetting;
}

interface IOErrorParam<T> {
  errors: IOError[];
  detail?: T;
}

type IOError = Error | any;

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
};
