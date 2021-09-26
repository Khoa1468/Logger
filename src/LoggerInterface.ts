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
  lineColumm;
  fullFilePath: string;
}

export { LoggerInterface, ReturnGetTimeAndType };
