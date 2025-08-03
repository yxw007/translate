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
  /**
   * Maximum number of characters
   * default: 1000, -1 means no limit
   */
  max_character_num?: number | undefined;
};

export type CheckLanguageOptions<T extends Engines> = Pick<TranslateOptions<T>, "max_character_num" | "engine">;

export interface BaseEngineOption {}

export type EngineTranslateOptions<T extends Engines> = Omit<TranslateOptions<T>, "engine">;

export type Engine = {
  name: string;
  checkLanguage?: <T extends Engines>(text: string) => Promise<string>;
  translate: <T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) => Promise<string[]>;
};

export interface CacheRecord {
  value: unknown;
  timeout?: number;
  expire: number;
}

export class TranslationError extends Error {
  region: string;
  constructor(region: string, message: string) {
    super(message);
    this.region = region;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CheckLanguageError extends Error {
  region: string;
  constructor(region: string, message: string) {
    super(message);
    this.region = region;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { FromLanguage, ToLanguage };

export const OPEN_AI_MODELS = [
  "o1-preview",
  "o1-preview-2024-09-12",
  "o1-mini-2024-09-12",
  "o1-mini",
  "dall-e-2",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0125",
  "babbage-002",
  "davinci-002",
  "dall-e-3",
  "text-embedding-3-large",
  "gpt-3.5-turbo-16k",
  "tts-1-hd-1106",
  "text-embedding-ada-002",
  "text-embedding-3-small",
  "tts-1-hd",
  "whisper-1",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-instruct",
  "gpt-4o-mini-2024-07-18",
  "gpt-4o-mini",
  "tts-1",
  "tts-1-1106",
  "gpt-3.5-turbo-instruct-0914",
] as const;

export type OpenAIModel = (typeof OPEN_AI_MODELS)[number];
