import { Logger } from "./Logger.js";
import { format } from "util";

const logger = new Logger({
  format: "pretty",
  levelLog: Number.POSITIVE_INFINITY,
  useColor: true,
});

logger.on("logging", (lvl, data, msg) => {
  process.stdout.write(format.apply(null, [msg]));
});

logger.on("fatalLogging", (lvl, data, timeStamp, prefix, errors) => {
  process.stdout.write(format.apply(null, [prefix]));
});

logger.on("levelChange", (lvl, prev) => {
  process.stdout.write(
    format.apply(null, ["Previous level:", prev, "Now level:", lvl])
  );
});

logger.on("settingChange", (prev, newSetting) => {
  process.stdout.write(
    format.apply(null, ["Previous setting:", prev, "Now setting: ", newSetting])
  );
});

console.time("time");

logger.info("Hello");

console.timeEnd("time");

const childLogger = logger.child({ a: "b" }, { isChild: true });

childLogger.getBindingOpt().a;

childLogger.loggerProps.isChild;
