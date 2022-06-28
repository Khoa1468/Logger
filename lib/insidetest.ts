import { Logger } from "./Logger.js";
import { format } from "util";

const logger = new Logger<{ hi: string } & { hi2: string }, { hi2: string }>({
  format: "pretty",
  levelLog: Number.POSITIVE_INFINITY,
  useColor: true,
  instanceName: "mainLogger",
});

logger.on("willLog", (type, message, prefix, level, timeStamp) => {
  process.stdout.write(
    format("%s %s %s %s %s", timeStamp, prefix, type, level, message)
  );
});

logger.on(
  "childCreated",
  (
    parentLogger,
    childLogger,
    childSetting,
    childName,
    childProps,
    loggerProps
  ) => {
    console.log(childName);
  }
);

console.time("time");

const info = logger.info("Hello");

console.timeEnd("time");

// const loggerChild = logger.child({ hi: "hello" });
// const loggerChild2 = loggerChild.child({ hi2: "hello" });

// loggerChild2.info(loggerChild2.isChild);
