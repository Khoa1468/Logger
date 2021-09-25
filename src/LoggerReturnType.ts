import { LoggerInterface } from "./LoggerInterface.js";

export interface ReturnType {
  type: "log" | "warn" | "info" | "error";
  message: any;
  data: any[];
  loggedAt: string;
  filePath: string;
  fullFilePath: string;
  lineNumber: number;
  user: string;
  setting?: LoggerInterface
};