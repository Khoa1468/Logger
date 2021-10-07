import Logger from "./Logger.js";

const logger = new Logger({
  isLoggedAt: false,
  isDisplayRootFile: false,
  isType: false,
});

const result = logger.log("Hello, World!");

logger.log(result);
