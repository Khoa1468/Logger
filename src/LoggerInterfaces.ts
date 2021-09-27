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

type IOError = Error | undefined | unknown;

export {
  IOLoggerInterface,
  IOReturnGetTimeAndType,
  IOLevelLogId,
  IOReturnType,
  IOError,
  IOReturnError,
  IOErrorParam,
};
