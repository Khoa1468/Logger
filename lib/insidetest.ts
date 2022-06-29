import { Logger } from "./Logger.js";
import { format } from "util";

const logger = new Logger({
  format: "pretty",
  levelLog: Number.POSITIVE_INFINITY,
  useColor: true,
  instanceName: "mainLogger",
});

// logger.on("fatalLogging", (lvl, data, timeStamp, prefix, errors) => {
//   logger.info(errors);
// });

console.time("time");

const info = logger.info("Hi");

console.timeEnd("time");

logger.info(info);

// logger.fatal({ errors: [new Error("Hi")] });

// const loggerChild = logger.child({ hi: "hello" });
// const loggerChild2 = loggerChild.child({ hi2: "hello" });

// loggerChild2.info(loggerChild2.isChild);
