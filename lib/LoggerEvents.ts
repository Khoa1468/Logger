import { EventEmitter } from "events";
import { IOKeyEvents } from "./LoggerInterfaces";

export class LoggerEvent extends EventEmitter {
  public on<K extends keyof IOKeyEvents>(
    eventName: K,
    listener: (...args: IOKeyEvents[K]) => void
  ): this {
    super.on(eventName, listener as (...args: any) => void);
    return this;
  }
  public once<K extends keyof IOKeyEvents>(
    eventName: K,
    listener: (...args: IOKeyEvents[K]) => void
  ): this {
    super.once(eventName, listener as (...args: any) => void);
    return this;
  }
  public off<K extends keyof IOKeyEvents>(
    eventName: K,
    listener: (...args: IOKeyEvents[K]) => void
  ): this {
    super.off(eventName, listener as (...args: any) => void);
    return this;
  }
  public addListener<K extends keyof IOKeyEvents>(
    eventName: K,
    listener: (...args: IOKeyEvents[K]) => void
  ): this {
    super.addListener(eventName, listener as (...args: any) => void);
    return this;
  }
  public prependListener<K extends keyof IOKeyEvents>(
    eventName: K,
    listener: (...args: IOKeyEvents[K]) => void
  ): this {
    super.prependListener(eventName, listener as (...args: any) => void);
    return this;
  }
  public prependOnceListener<K extends keyof IOKeyEvents>(
    eventName: K,
    listener: (...args: IOKeyEvents[K]) => void
  ): this {
    super.prependOnceListener(eventName, listener as (...args: any) => void);
    return this;
  }
  public removeListener<K extends keyof IOKeyEvents>(
    eventName: K,
    listener: (...args: IOKeyEvents[K]) => void
  ): this {
    super.removeListener(eventName, listener as (...args: any) => void);
    return this;
  }
  public emit<K extends keyof IOKeyEvents>(
    eventName: K,
    ...args: IOKeyEvents[K]
  ): boolean {
    return super.emit(eventName, ...args);
  }
  public removeAllListeners<K extends keyof IOKeyEvents>(event?: K): this {
    super.removeAllListeners(event);
    return this;
  }
  public listenerCount<K extends keyof IOKeyEvents>(eventName: K): number {
    return super.listenerCount(eventName);
  }
  public listeners<K extends keyof IOKeyEvents>(eventName: K): Function[] {
    return super.listeners(eventName);
  }
  public rawListeners<K extends keyof IOKeyEvents>(eventName: K): Function[] {
    return super.rawListeners(eventName);
  }
  public setMaxListeners(n: number): this {
    super.setMaxListeners(n);
    return this;
  }
  public getMaxListeners(): number {
    return super.getMaxListeners();
  }
  public eventNames(): (string | symbol)[] {
    return super.eventNames();
  }
}
