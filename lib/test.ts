import Logger from "./Logger.js";

const logger = new Logger({
  format: "pretty",
});

const result = logger.log("Hello, World!");

logger.log(result);
