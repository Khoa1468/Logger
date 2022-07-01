import { Logger } from "./";
import { format } from "util";

function printOut(...data: any[]) {
  process.stdout.write(format.apply(null, data));
}

const logger: Logger<{}, {}> = new Logger({
  format: "pretty",
  levelLog: Number.POSITIVE_INFINITY,
  useColor: true,
  instanceName: "mainLogger",
  short: false,
});

// logger.on("logging", (lvl, data, msg, timeStamp, prefix) => {
//   printOut(lvl, data, msg, timeStamp, prefix);
// });

// logger.on("fatalLogging", (lvl, data, timeStamp, prefix, errors) => {
//   printOut(lvl, data, timeStamp, prefix, errors);
// });

console.time("time");

// const info = logger.info("Hi");

console.timeEnd("time");

// logger.fatal({ errors: [new Error("Hello"), new TypeError("Hi")] });

const bruh: any[] = [];

for (var i in logger) {
  bruh.push(i);
}

logger.info(bruh);
logger.info(bruh.length);

// logger.info(Object.getOwnPropertyNames(logger));

// Object.getPrototypeOf

// const childLogger = logger.child({ hello: "world" }, { isChild: true });
