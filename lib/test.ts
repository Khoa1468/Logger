import { Logger } from "./Logger.js";
import { IOLevelLog } from "./LoggerInterfaces.js";

const logger = new Logger({
  format: "pretty",
  levelLog: [IOLevelLog.ALL],
  useColor: true,
});

console.time("time");

logger.info("Hello");

console.timeEnd("time");

// // const info = logger.info("hi");

// const childLogger = logger.child(
//   { thisIsChild: true },
//   { thisIsLoggerOpt: true, hi: "hi" }
// );

// console.time("time");

// const info2 = childLogger.info("hi");

// console.timeEnd("time");
