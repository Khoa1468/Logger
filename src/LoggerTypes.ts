import { LoggerInterface } from "./LoggerInterface.js";

export type IOError = Error | undefined | unknown;

export interface IOReturnError {
  nativeError: Error;
  detail: object;
  name: string;
  isError: true;
}
export type levelLogId = "log" | "warn" | "info" | "error" | "fatal";
export interface ReturnType {
  levelLog: levelLogId;
  data: (IOReturnError | unknown)[];
  loggedAt: string;
  filePath: string;
  fullFilePath: string;
  lineNumber: number;
  lineColumm: number;
  user: string;
  setting?: LoggerInterface;
}

export interface ErrorReturnType {
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
