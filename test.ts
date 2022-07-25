import { Logger } from "./";
import { format } from "util";
import { IOReturnType } from "./";
import { TransportFileProvider } from "./";
import path from "path";
// import { fileURLToPath } from "url"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const logger: Logger<{}, {}> = new Logger({
  format: "pretty",
  levelLog: Number.POSITIVE_INFINITY,
  useColor: true,
  instanceName: "mainLogger",
  short: false,
  transportType: "file",
});

const date = new Date();

const initData = `Logged from '${logger.loggerName}': ${date.getUTCDate()}-${
  date.getUTCMonth() + 1
}-${date.getUTCFullYear()} ${date.toLocaleTimeString()}\n`;

const filePath = path.join(
  __dirname,
  `./logs/info-${date.getUTCDate()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCFullYear()}.log`
);

logger.attachFileTransport(
  new TransportFileProvider({
    filePath: filePath,
    transportLevels: ["info", "error", "fatal"],
    newLine: true,
    initData,
    initAndRewriteWhenStart: true,
    verbose: true,
  })
);

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

eval("logger.info('Hello, World!')");
