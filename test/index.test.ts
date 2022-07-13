import { Logger } from "../";

describe("Logging test", () => {
  const initLogger = new Logger({
    format: "pretty",
    levelLog: Number.POSITIVE_INFINITY,
    useColor: true,
    instanceName: "mainLogger",
  });

  initLogger.on("logging", (type, data, msg, timeStamp) => {
    return msg;
  });

  const logSample = initLogger.info("Hi");

  it("hi", () => {
    expect(logSample.fullPrefix.ToString).toEqual(logSample.fullPrefix.ToString);
  });
});
