import { Logger } from "./Logger.js";
import { format } from "util";
import { IOReturnType } from "./LoggerInterfaces.js";
import { TransportFileProvider } from "./TransportFile.js";
import path from "path";
// import { fileURLToPath } from "url"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

function printOut(...data: any[]) {
  process.stdout.write(format.apply(null, data));
}

const logger: Logger<{}, {}> = new Logger({
  format: "pretty",
  levelLog: Number.POSITIVE_INFINITY,
  useColor: true,
  instanceName: "mainLogger",
  short: false,
  transportType: "file",
});

// logger.on("logging", (lvl, data, msg, timeStamp, prefix) => {
//   printOut(prefix, msg, "\n");
// });

function test(testArg: IOReturnType<any, any>) {
  console.log("Transport:", testArg.fullPrefix.ToString, ...testArg.data);
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

const date = new Date();

const initData = `Logged from '${logger.loggerName}': ${date.getUTCDate()}-${
  date.getUTCMonth() + 1
}-${date.getUTCFullYear()} ${date.toLocaleTimeString()}\n`;

const filePath = path.join(
  __dirname,
  "..",
  `./logs/info-${date.getUTCDate()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCFullYear()}.log`
);

// logger.attachFileTransport(
// new TransportFileProvider({
//   filePath: filePath,
//   transportLevels: ["info", "error"],
//   newLine: true,
//   initData,
//   initAndRewriteWhenStart: true,
//   verbose: true,
// });
// );

console.time("time");

const info = logger.info("Hello, World!");

console.timeEnd("time");

logger.error("Error!");

logger.warn("Warn!");

logger.fatal({ errors: [new Error("Fatal!")] });

// logger.info("Welcome to osu!");

// logger.fatal({
//   errors: [new Error("Hello"), new TypeError("This is TypeError")],
// });
