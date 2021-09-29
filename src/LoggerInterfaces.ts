interface IOLoggerInterface {
  instanceName?: string;
  isLoggedAt?: boolean;
  isType?: boolean;
  isDisplayRootFile?: boolean;
  cagetoryName?: string;
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

interface IOReturnError {
  nativeError: IOError[];
  detail: object;
  user: string;
  isError: true;
  filePath: string;
  fullFilePath: string | null;
  lineNumber: number | null;
  lineColumm: number | null;
}

type IOLevelLogId = "log" | "warn" | "info" | "error" | "fatal";

interface IOReturnType {
  levelLog: IOLevelLogId;
  data: IOReturnError | unknown[];
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

type IOError = Error | undefined | unknown;

export {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
  IOSetting,
};
