import { Logger } from "./Logger.js";
import { format } from "util";
import chalk from "chalk";
import { IOReturnType } from "./LoggerInterfaces.js";

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

logger.on("logging", (lvl, data, msg, timeStamp, prefix) => {
  printOut(prefix, msg, "\n");
});

function test(testArg: IOReturnType<any, any>) {
  console.log(testArg);
}

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

console.time("time");

const info = logger.info("Hi");

console.timeEnd("time");
