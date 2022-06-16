# Start From 1.6.7 version

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
