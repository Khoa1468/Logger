import { format } from "util";
import { Logger } from "./Logger.js";
import { IOLevelLog } from "./LoggerInterfaces.js";

const logger = new Logger({
  format: "pretty",
  levelLog: [IOLevelLog.ALL],
  useColor: true,
});

// console.time("time");

// logger.info("This is a info message");

// // console.timeEnd("time");

// const childLogger = logger.child(
//   { childLoggerReturnProperty: "Hi" },
//   { childLoggerProperty: "Hello" }
// );

// console.time("time");

// const info = childLogger.info("This is a info message");

// childLogger.info(info.childLoggerReturnProperty);

// childLogger.info(childLogger.loggerProps.childLoggerProperty);

// console.timeEnd("time");
console.time("time");
// logger.fatal({ errors: [new Error("Hi")] });
logger.info("Hello");
// process.stdout.write(format.apply(null, ["Hello"]));
console.timeEnd("time");
