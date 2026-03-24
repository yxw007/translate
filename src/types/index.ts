import type { BuiltinEngineLanguageMap, BuiltinFromLanguageMap, BuiltinToLanguageMap } from "../language/engines";
export * from "./typescript";
export type Engines = keyof BuiltinEngineLanguageMap;

export type LanguageMap = Readonly<Record<string, string>>;
export type LanguageName<T extends LanguageMap = LanguageMap> = Extract<keyof T, string>;
export type LanguageCode<T extends LanguageMap = LanguageMap> = T[LanguageName<T>];
export type FromLanguage<T extends string = Engines> = T extends Engines ? BuiltinFromLanguageMap[T] : string;
export type ToLanguage<T extends string = Engines> = T extends Engines ? BuiltinToLanguageMap[T] : string;

export type TranslateOptions<T extends string = Engines> = {
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

export type CheckLanguageOptions<T extends string = Engines> = Pick<TranslateOptions<T>, "max_character_num" | "engine">;

export interface BaseEngineOption {
  fromLanguages?: LanguageMap;
  toLanguages?: LanguageMap;
}

export type EngineTranslateOptions<T extends string = string> = Omit<TranslateOptions<T>, "engine">;

export type Engine = {
  name: string;
  getFromLanguages: () => LanguageMap;
  getToLanguages: () => LanguageMap;
  normalFromLanguage: (language?: string) => string;
  normalToLanguage: (language?: string) => string;
  checkLanguage?: (text: string) => Promise<string>;
  translate: (text: string | string[], opts: EngineTranslateOptions) => Promise<string[]>;
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
    this.name = "TranslationError";
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class CheckLanguageError extends Error {
  region: string;
  constructor(region: string, message: string) {
    super(message);
    this.region = region;
    this.name = "CheckLanguageError";
    Error.captureStackTrace?.(this, this.constructor);
  }
}

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
