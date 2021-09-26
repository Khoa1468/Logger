interface IOLoggerInterface {
  name?: string;
  isLoggedAt?: boolean;
  isType?: boolean;
  isDisplayRootFile?: boolean;
  cagetoryName?: string;
}

interface IOReturnGetTimeAndType {
  ToString: string;
  filePath: string;
  lineNumber: number;
  lineColumm: number;
  fullFilePath: string;
}

interface IOReturnError {
  nativeError: IOError[];
  detail: object;
  user: string;
  isError: true;
  filePath: string;
  fullFilePath: string;
  lineNumber: number;
  lineColumm: number;
}

type IOLevelLogId = "log" | "warn" | "info" | "error" | "fatal";

interface IOReturnType {
  levelLog: IOLevelLogId;
  data: IOReturnError | unknown[];
  loggedAt: string;
  filePath: string;
  fullFilePath: string;
  lineNumber: number;
  lineColumm: number;
  user: string;
  cagetory: string;
  setting?: IOLoggerInterface;
}

interface IOErrorParam<T> {
  errors: IOError[];
  detail?: T;
}

interface IOErrorReturnType {
  type: "error";
  typeError: string;
  message: string;
  loggedAt: string;
  filePath: string;
  fullFilePath: string;
  lineNumber: number;
  user: string;
  setting?: IOLoggerInterface;
  fullError: Error[];
}

type IOError = Error | undefined | unknown;

export {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOErrorReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
};
