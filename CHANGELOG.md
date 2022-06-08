# Start From 1.6.7 pre-alpha version

## 1.6.7 pre-alpha

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

import { Logger } from "./Logger";
import { IOLevelLog } from "./LoggerInterfaces";

const logger = new Logger({
  format: "pretty",
  levelLog: [IOLevelLog.ALL /*Using Enum Here*/],
});
```

- Adding prefix logging method:

```js
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
