import { Logger } from "./Logger.js";
import { format } from "util";
import chalk from "chalk";

function printOut(...data: any[]) {
  process.stdout.write(format.apply(null, data));
}

const logger: Logger<{}, {}> = new Logger({
  format: "json",
  levelLog: Number.POSITIVE_INFINITY,
  useColor: true,
  instanceName: "mainLogger",
  short: false,
});

console.time("time");

const info = logger.info("Hi");

console.timeEnd("time");

chalk["grey"];

// logger.info(info);

// const fatal = logger.fatal({ errors: [new Error("Hi")] });

// logger.info(fatal.data[0].filePath);
