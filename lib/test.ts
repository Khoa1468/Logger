import { format } from "util";
import { Logger } from "./Logger.js";
import { IOLevelLog } from "./LoggerInterfaces.js";

const logger = new Logger({
  format: "pretty",
  levelLog: [IOLevelLog.ALL],
  useColor: true,
});

const childLogger = logger.child(
  { a: "b" },
  { c: "d", childProps: { a: "c" } }
);

const info = childLogger.info(childLogger.loggerProps);

childLogger.info({ hello: "world" });
