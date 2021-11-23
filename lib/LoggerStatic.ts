import { LoggerConsole } from "./LoggerConsole.js";

interface SubscribeInterface {
  subscribe: () => string;
}

const VERSION_STR = "Version 1.6.2";

export class LoggerStatic extends LoggerConsole {
  public static thankYou(): SubscribeInterface {
    console.log("Thank You For Using This Logger");
    return {
      subscribe(): string {
        return "Please follow my github: https://github.com/Khoa1468/";
      },
    };
  }
  public static get VERSION(): string {
    return VERSION_STR;
  }
  public get VERSION(): string {
    return VERSION_STR;
  }
  public static isProd(env: string = "LOGGER_ENV"): boolean {
    const envValue = env in process.env;
    const getFromProcess =
      Number.parseInt(process.env[env]!, 10) === 1 ||
      process.env[env] === "production" ||
      process.env[env] === "prod";
    return envValue ? getFromProcess : false;
  }
  public isProd(env: string = "LOGGER_ENV"): boolean {
    const envValue = env in process.env;
    const getFromProcess =
      Number.parseInt(process.env[env]!, 10) === 1 ||
      process.env[env] === "production" ||
      process.env[env] === "prod";
    return envValue ? getFromProcess : false;
  }
}
