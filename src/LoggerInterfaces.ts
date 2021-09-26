interface LoggerInterface {
  name?: string;
  isLoggedAt?: boolean;
  isType?: boolean;
  // isDisplayObjectAsJson?: boolean;
  isDisplayRootFile?: boolean;
}

interface ReturnGetTimeAndType {
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

type levelLogId = "log" | "warn" | "info" | "error" | "fatal";

interface ReturnType {
  levelLog: levelLogId;
  data: IOReturnError | unknown[];
  loggedAt: string;
  filePath: string;
  fullFilePath: string;
  lineNumber: number;
  lineColumm: number;
  user: string;
  setting?: LoggerInterface;
}

interface IOErrorParam<T> {
  errors: IOError[];
  detail?: T;
}

interface ErrorReturnType {
  type: "error";
  typeError: string;
  message: string;
  loggedAt: string;
  filePath: string;
  fullFilePath: string;
  lineNumber: number;
  user: string;
  setting?: LoggerInterface;
  fullError: Error[];
}

type IOError = Error | undefined | unknown;

export {
  LoggerInterface,
  ReturnGetTimeAndType,
  levelLogId,
  ReturnType,
  ErrorReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
};
