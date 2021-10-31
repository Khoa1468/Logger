import { LoggerConsole } from "./LoggerConsole.js";

interface SubscribeInterface {
  subscribe: () => string;
}

const VERSION_STR = "Version 1.5.0";

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
}
