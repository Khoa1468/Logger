import { Logger } from "./Logger.js";
import { IOLevelLog } from "./LoggerInterfaces.js";

const logger = new Logger(
  {
    format: "pretty",
    levelLog: [IOLevelLog.ALL],
  },
  (Logger) => {
    const logger = new Logger({ format: "pretty", levelLog: [5] });
    logger.info("Logger Loaded");
  }
);
console.time("time start");
const log = logger.log("Hello, I Am A Normal Log!");
const warn = logger.warn("Hello, I A Warning Log!");
const error = logger.error("Hello, I Am A Error");
const debug = logger.debug("Hello, I Am A Debug Log!");
const info = logger.info("Hello, I Am A Info Log!");
const fatal = logger.fatal({
  errors: [
    new Error("Hello, I Am A Fatal Log!"),
    new Error("This Is A My Error"),
  ],
});
const prefix = logger.prefix("Custom", "Hello, I Am A Prefix Log!");
console.timeEnd("time start");
logger.setSettings({ levelLog: [IOLevelLog.NORMAL] });

// logger.log(logger.getAllLogObj().allLogObj.data);

logger.log(log);
logger.log(warn);
logger.log(error);
logger.log(debug);
logger.log(info);
logger.log(fatal);
logger.log(prefix);
// logger.log(logger.getAllLogObj().allLogObj.data);
