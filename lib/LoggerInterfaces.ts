import { Logger as LoggerClass } from "./Logger.js";
import { ForegroundColor } from "chalk";

const enum IOLevelLog {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  NORMAL = 4,
}

type IOLevelLogList = IOLevelLog[];

type IOChildLoggerProperty<LP> = Readonly<{ loggerProps: Readonly<LP> }>;

interface IOLoggerInterface {
  instanceName?: string;
  cagetoryName?: string;
  format?: "json" | "pretty" | "hidden";
  short?: boolean;
  levelLog?: IOLevelLog;
  useColor?: boolean;
}

interface IOSetting extends IOLoggerInterface {
  hostName: string;
}

type IOReturnType<T extends any[], P = {}> = IOBaseReturnType<T> & {
  bindingProps: P;
};

type ChildLogger<P extends {}, T extends {}, LP extends {} = {}> = LoggerClass<
  P & T,
  P
> &
  Readonly<
    Readonly<{
      loggerProps: Readonly<LP>;
    }>
  >;

interface IOOnloadInterface<P extends {}> {
  (Logger: LoggerClass<P, {}>): void;
}

interface IOReturnGetTimeAndType {
  ToString: string;
}

type IOStd<T extends any[] = []> = T;

interface IOErrorStack {
  filePath: string;
  fullFilePath: string | undefined;
  lineNumber: number | undefined;
  lineColumm: number | undefined;
  functionName: string | undefined;
  methodName: string | undefined;
  isConstructor: boolean | undefined;
}

interface IOReturnError extends IOErrorStack {
  defaultError: Error;
  nativeError: string;
  detail: object | undefined;
  user: string;
  isError: true;
}

type IOLevelLogId = "warn" | "info" | "error" | "fatal" | "prefix";

interface IOBaseReturnType<T extends any[] = []> extends IOErrorStack {
  levelLog: IOLevelLogId;
  prefix: string;
  color: typeof ForegroundColor;
  levelRange: IOLevelLog;
  data: IOStd<T>;
  loggedAt: string;
  hostName: string;
  instanceName: string;
  cagetory: string;
  setting?: IOSetting;
  toJson: () => string;
  pid: number;
}

interface IOErrorParam<T> {
  errors: IOError[];
  detail?: T;
}

type IOError = Error;

interface IOPrefixOption {
  prefix?: string;
  color?: typeof ForegroundColor;
  levelLog?: number;
}

interface IOKeyEvents {
  levelChange: [lvl: IOLevelLog, prevLvl: IOLevelLog];
  logging: [
    lvl: IOLevelLog,
    data: IOBaseReturnType<any[]>,
    msg: string,
    timeStamp: Date
  ];
  fatalLogging: [
    lvl: IOLevelLog,
    data: IOBaseReturnType<IOReturnError[]>,
    timeStamp: Date,
    prefix: string,
    errors: IOError[]
  ];
  settingChange: [prevSetting: IOSetting, newSetting: IOSetting];
  childCreated: [
    parentLogger: LoggerClass<any, any>,
    childLogger: LoggerClass<any, any>,
    childSetting: IOLoggerInterface,
    childName: string,
    childProps: any,
    loggerProps: IOChildLoggerProperty<any>
  ];
  willLog: [
    type: IOLevelLogId,
    message: any[],
    prefix: string | undefined,
    level: IOLevelLog,
    timeStamp: Date
  ];
  loggerNameChange: [prevName: string, newName: string];
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
  IOLevelLogList,
  IOOnloadInterface,
  IOLevelLog,
  IOPrefixOption,
  IOReturnType,
  ChildLogger,
  IOChildLoggerProperty,
  IOKeyEvents,
};
