# Start From 1.6.7 version

## 1.6.12

- Performance is good, now

- Added transport to stdout
  
  ```ts
  import { Logger, IOReturnType } from "@khoa1468/logger";
  
  const logger: Logger<{}, {}> = new Logger({
    format: "pretty",
    levelLog: Number.POSITIVE_INFINITY,
    useColor: true,
    instanceName: "mainLogger",
    short: false,
  });
  
  // This is a transport function when Logger logging, this will be called with passed argument
  function test(testArg: IOReturnType<any, any>) {
    console.log(testArg);
  }
  
  // This line will create and push new transport provider
  logger.attachTransport({
    minLvl: "info",
    functions: {
      error: test,
      fatal: test,
      warn: test,
      info: test,
      prefix: test,
    },
  });
  
  const info = logger.info("Hi");
  ```

- Added `IOTransportProvider` to create transport provider
  
  ```ts
  type IOLevelLogId = "warn" | "info" | "error" | "fatal" | "prefix";
  
  type IOTransportFunction = {
    [key in IOLevelLogId]: (logObject: IOReturnType<any, any>) => any;
  };
  
  interface IOTransportProvider {
    functions: IOTransportFunction;
    minLvl: IOLevelLogId;
  }
  ```

- Added `attachTransport(transport: IOTransportProvider)` method to create and push new `IOTransportProvider`

- Added transport to file
  
  - Typescript
  
  ```ts
  import { Logger, TransportFileProvider } from "@khoa1468/logger";
  import path from "path";
  
  const logger = new Logger({
    format: "pretty",
    levelLog: Number.POSITIVE_INFINITY,
    useColor: true,
    instanceName: "mainLogger",
    short: false,
    transportType: "file", /*specify transport type "none" or "file" or "stdout"*/
  });
  
  logger.attachFileTransport(new TransportFileProvider({
      filePath: path.join(__dirname, "info.log"),
      transportLevels: ["info", "error"],
      newLine: true,
      initData: "",
      initAndRewriteWhenStart: true,
      verbose: true,
  }));
  
  logger.info("Hello");
  ```
  
  - Javascript
  
  ```js
  const { Logger, TransportFileProvider } = require("@khoa1468/logger");
  const path = require("path");
  
  const logger = new Logger({
    format: "pretty",
    levelLog: Number.POSITIVE_INFINITY,
    useColor: true,
    instanceName: "mainLogger",
    short: false,
    transportType: "file", /*specify transport type "none" or "file" or "stdout"*/
  });
  
  logger.attachFileTransport(new TransportFileProvider({
      filePath: path.join(__dirname, "info.log"),
      transportLevels: ["info", "error"],
      newLine: true,
      initData: "",
      initAndRewriteWhenStart: true,
      verbose: true,
  }));
  
  logger.info("Hello");
  ```

- Added `defaultLevelRange` in `IOBaseReturnType` to get default level range of `prefix` logging method

- Added new `toJson()` to colorize the json string

- Added new class `TransportFileProvider`
  
  - Declaration of `TransportFileProvider`
  
  ```ts
  export declare class TransportFileProvider {
      transportProvider: IOFileTransportProvider;
      private init;
      constructor(transportProvider: IOFileTransportProvider);
      write(logObject: IOReturnType<any[], any>): void;
  }
  ```

- Added new interface `IOFileTransportProvider`
  
  - Declaration of `IOFileTransportProvider`
  
  ```ts
  interface IOFileTransportProvider {
      filePath: string;
      transportLevels: IOLevelLogId[];
      newLine?: boolean;
      initData?: string;
      initAndRewriteWhenStart?: boolean;
      verbose?: boolean;
  }
  ```

## 1.6.11

- Small fix, clean code, increase performance

- Added colorized with `json` print type

## 1.6.10

- Increase performance

- Remove `IOLevelLog.ALL`

- Added `events.EventEmitter` with 7 events:
  
  - API interface `IOKeyEvents` to get 7 events:
    
    - `levelChange`
    - `logging`
    - `fatalLogging`
    - `settingChange`
    - `childCreated`
    - `willLog`
    - `loggerNameChange`

- Bring back `onInit()`
  
  ```ts
  const logger = new Logger(
    {
      format: "pretty",
      levelLog: Number.POSITIVE_INFINITY,
      useColor: true,
    },
    (Logger) => {
      Logger.info("Logger is ready");
    }
  );
  ```

- Changed `stacktrace.ts` to `error-stack-parser` package

- `loggerProps`, `childProps` and `getBindingOpt()` now is read-only
  
  ```ts
  const logger = new Logger({
    format: "pretty",
    levelLog: Number.POSITIVE_INFINITY,
    useColor: true,
  });
  
  const childLogger = logger.child({ a: "b" }, { isChild: true });
  
  childLogger.getBindingOpt().a; /* Nothing happend */
  childLogger.getBindingOpt().a = "c"; /* This line will throw Error */
  
  childLogger.loggerProps.isChild; /* Nothing happend */
  childLogger.loggerProps.isChild = false; /* This line will throw Error */
  ```

- Added `isChild`, `parentName`, `parentOldProps` and new `child()` method
  
  ```ts
  export class Logger<P extends {}, OP extends {} = {}> extends LoggerUtils<P> {
    private _isChild: boolean = false;
    private _parentName: string = "";
    public parentOldProps: Readonly<OP> = {} as Readonly<OP>;
    public get isChild(): boolean {
      return this._isChild;
    }
    public get parentName(): string {
      return this._parentName;
    }
    /* <Some logic code . . .> */
  
    public child<T extends {}, LP extends {} = {}>(
      bindingOpt?: T,
      loggerOpt?: LP,
      childSetting: IOLoggerInterface = this.listSetting()
    ): ChildLogger<P, T, LP> {
      const childLogger: Logger<P & T, P> = new Logger<P & T, P>({
        ...this.listSetting(),
        ...childSetting,
      });
  
      const loggerProps = Object.freeze({
        loggerProps: Object.freeze(loggerOpt),
      } as IOChildLoggerProperty<LP>);
  
      let bindingLoggerProps = Object.assign(childLogger, loggerProps);
  
      bindingLoggerProps.isChild = true;
      bindingLoggerProps.childProps = {
        ...this.childProps,
        ...(bindingOpt ?? ({} as T)),
      };
      bindingLoggerProps.parentName = this.loggerName;
      bindingLoggerProps.parentOldProps = this.getBindingOpt();
  
      this.emit(
        "childCreated",
        this,
        bindingLoggerProps,
        childSetting,
        childSetting.instanceName || this.listSetting().instanceName || "",
        Object.freeze(bindingOpt!),
        loggerProps
      );
      return bindingLoggerProps;
    }
  }
  ```

- Added `getBindingOpt()` to get `childProps`
  
  ```ts
  const logger = new Logger({
    format: "pretty",
    levelLog: Number.POSITIVE_INFINITY,
    useColor: true,
  });
  
  const childLogger = logger.child({ a: "b" }, { isChild: true });
  
  console.log("Binding:", childLogger.getBindingOpt().a);
  
  /*----------------Output----------------*/
  /*
  Binding: b
  */
  ```

- Edited `IOErrorStack`
  
  ```ts
  interface IOErrorStack {
    filePath: string;
    fullFilePath: string | undefined;
    lineNumber: number | undefined;
    lineColumm: number | undefined;
    functionName: string | undefined;
    methodName: string | undefined;
    isConstructor: boolean | undefined;
  }
  ```

- Added `useExpressLogger()` for `express`
  
  ```ts
  import express from "express";
  import Logger from "@khoa1468/logger";
  import { useExpressLogger } from "@khoa1468/logger";
  
  const app = express();
  
  const logger = new Logger();
  
  app.use(
    useExpressLogger(
      logger /* Your logger here */,
      logger.listSetting() /* Your setting of the logger */
    )
  );
  ```

- `levelLog` is now a `number` not an `Array`
  
  ```ts
  protected levelLog: IOLevelLog = IOLevelLog.NONE;
  ```

- Added custom level log for `prefix()` logging method
  
  ```ts
  logger.prefix({
    prefix: "Prefix" /* <Your Prefix> */,
    color: "red" /* <Your Color> */,
    levelLog: 100 /* <Your Level> */,
  });
  ```

## 1.6.9

- Small fixed, increase perfomance

## 1.6.8

- Removed log(), debug() logging method

- Optimized the code for better perfomance

- Removed isLoggedAt, isType, isDisplayRootFile

- Change name IOReturnType interface to IOBaseReturnType

- Print-out function changed to process.stdout; process.stderr for better perfomance

- Removed onInit() method

- Adding NEW IOReturnType
  
  ```ts
  type IOReturnType<T extends any[], P = {}> = IOBaseReturnType<T> & P;
  ```

- Adding PID log output and log object
  
  ```ts
  import { Logger, IOLevelLog } from "@khoa1468/logger";
  
  const logger = new Logger({
    format: "pretty",
    levelLog: [IOLevelLog.ALL],
  });
  
  logger.info("Hi");
  ```
  
  ```bash
  [Type: Info, Time: <Time and Date>, File: <File and Directory run a code>, PID: <Process ID>] [Khoa] Hi
  ```
  
  ```ts
  /*----------------LOG DATA----------------*/
  
  /*
    {
      pid: <Process ID>
      <Some log object properties>
    }
  */
  ```

- Adding child() method
  
  ```ts
  // child() method will create children logger object will extends all properties in IOReturnType interface and parent logger then merge with your properties binding in args
  
  import { Logger, IOLevelLog } from "@khoa1468/logger";
  
  const logger = new Logger({
    format: "pretty",
    levelLog: [IOLevelLog.ALL],
  });
  
  const childLogger = logger.child({ a: "b" }, { c: "d" });
  //                               ↑               ↑
  //                    <Binding argument> <Logger properties argument>
  const info = childLogger.info("Hi");
  
  /*----------------LOG DATA----------------*/
  
  /*
    {
      a: "b" <YOUR BINDING DATA>
      pid: <Process ID>
      <Some Log Object Property>
  */
  
  /*----------------LOGGER PROPERTY WHEN PRINT OUT CONSOLE----------------*/
  
  /*
    Logger {
      name: <Logger Name>,
      cagetoryName: <Your Cagetory Name>,
      hostname: <Host Name>,
      format: <Your Format>,
      short: <Print Short>,
      pid: <Process ID>,
      levelLog: <Level Log>,
      childProp: <Your Binding Argument>,
      c: 'd' <Your Logger Properties Argument>
    }
  */
  ```

## 1.6.7

- Adding enum level of log

```typescript
const enum IOLevelLog {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  DEBUG = 3,
  NORMAL = 4,
  ALL = 5,
}

/*----------------USING----------------*/

import { Logger, IOLevelLog } from "@khoa1468/logger";

const logger = new Logger({
  format: "pretty",
  levelLog: [IOLevelLog.ALL /*Using Enum Here*/],
});
```

- Adding prefix logging method:

```ts
const logger = new Logger({
  format: "pretty",
  levelLog: [IOLevelLog.ALL],
});

logger.prefix(
  /*prefix: string*/ "Prefix",
  /*message_args: T*/ "Message string"
);

/*----------------LOG DATA----------------*/

/*
    {
      levelLog: 'Prefix', <Your prefix>
      data: [ 'Message string' ], <Your message datas format as array>
      loggedAt: <Your Time>,
      hostName: <Your Host Name>,
      instanceName: <Your Instance Name>,
      cagetory: <Your Cagetory By Default Is Your Host Name>,
      filePath: <Your File Path>,
      fullFilePath: <Your File Path>,
      lineNumber: <Line Number>,
      lineColumm: <Line Culumm>,
      methodName: <Method Using prefix() logging function>,
      functionName: <Function Using prefix() logging function>,
      isConstructor: <Is Using In Constructor Of Your Class>,
      typeName: <Type Of Scope>,
      setting: {
        instanceName: <Your Instance Name>,
        isLoggedAt: true,
        isType: true,
        isDisplayRootFile: true,
        cagetoryName: <Your Cagetory By Default Is Your Host Name>,
        hostName: <Your Host Name>,
        format: 'pretty',
        levelLog: [ 5 ]
      },
      toJson: [Function: toJson]
    }
  */
```
