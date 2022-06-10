import { Logger } from "./Logger.js";
import { IOLevelLog } from "./LoggerInterfaces.js";

const logger = new Logger({
  format: "pretty",
  levelLog: [IOLevelLog.ALL],
});

const info = logger.info("Hello, I Am A Info Log!");

logger.info(info);

const childLogger = logger.child({ a: "b" }, { c: "d", childProp: { a: "c" } });

const info1 = childLogger.info(childLogger);

childLogger.info(info1);

const info2 = childLogger.info("hi");

childLogger.info(info2);
