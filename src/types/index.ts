import { engines } from "../engines";
import type { FromLanguage, ToLanguage } from "../language";
export * from "./typescript";
export type Engines = keyof typeof engines;

export type TranslateOptions<T extends Engines> = {
  from?: FromLanguage<T>;
  to: ToLanguage<T>;
  engine?: T;
  /**
   * Cache time in milliseconds
   */
  cache_time?: number | undefined;
  /**
   * Domain to use for translation
   */
  domain?: string | undefined;
};

export interface BaseEngineOption {}

export type EngineTranslateOptions<T extends Engines> = Omit<TranslateOptions<T>, "engine">;

export type Engine = {
  name: string;
  translate: <T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) => Promise<string[]>;
};

export interface CacheRecord {
  value: unknown;
  timeout?: number;
  expire: number;
}

export { FromLanguage, ToLanguage };
