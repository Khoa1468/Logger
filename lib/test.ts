import Logger from "./Logger.js";

const logger = new Logger({
  format: "pretty",
  // levelLog: [0],
});

const log = logger.log("Hello, I Am A Normal Log!");
const warn = logger.warn("Hello, I A Warning Log!");
const error = logger.error("Hello, I Am A Error");
const debug = logger.debug("Hello, I Am A Debug Log!");
const info = logger.info("Hello, I Am A Info Log!");
const fatal = logger.fatal({
  errors: [
    new Error("Hello, I Am A Fatal Log!"),
    new Error("This Is A My Error"),
  ],
});

logger.setSettings({ levelLog: [4] });

// logger.log(logger.getAllLogObj().allLogObj.data);

logger.log(log);
logger.log(warn);
logger.log(error);
logger.log(debug);
logger.log(info);
logger.log(fatal);
// logger.log(logger.getAllLogObj().allLogObj.data);
