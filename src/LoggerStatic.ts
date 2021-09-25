import { LoggerConsole } from "./LoggerConsole.js";

interface SubscribeInterface {
  subscribe: () => string;
}

export class LoggerStatic extends LoggerConsole {
  public static thankYou(): SubscribeInterface {
    console.log("Thank You For Using This Logger");
    return {
      subscribe(): string {
        return "Please follow my github: https://github.com/Khoa1468/";
      },
    };
  }
}
