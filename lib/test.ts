import { Logger } from "./Logger.js";
import { IOLevelLog } from "./LoggerInterfaces.js";

const logger = new Logger({
  format: "pretty",
  levelLog: [IOLevelLog.ALL],
});
console.time("time start");
// const log = logger.log("Hello, I Am A Normal Log!");
// const warn = logger.warn("Hello, I A Warning Log!");
// const error = logger.error("Hello, I Am A Error");
const info2 = logger.info("Hello, I Am A Info Log!");
// const fatal = logger.fatal({
//   errors: [
//     new Error("Hello, I Am A Fatal Log!"),
//     new Error("This Is A My Error"),
//   ],
// });
// const prefix = logger.prefix(undefined, "Hello, I Am A Prefix Log!");
console.timeEnd("time start");
logger.setSettings({ levelLog: [IOLevelLog.ALL] });

// logger.log(logger.getAllLogObj().allLogObj.data);

// const loggerChild = logger.child({ key: "value" });

// const info = loggerChild.info("Hello This Is A Child Logger");

// loggerChild.info(info);

// logger.log(log);
// logger.info(warn);
// logger.info(error);
// logger.log(debug);
// logger.info(info);
// logger.info(fatal);
// logger.info(prefix);
// logger.log(logger.getAllLogObj().allLogObj.data);

// const childLogger = logger.child({ a: "b" });

// const info = childLogger.info("Hello");

// logger.info(info);
