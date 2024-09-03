import { Language } from "@/language";

export interface TranslateOptions {
  from: Language;
  to: Language;
  engine?: string;
  cache_time?: number;
}

export interface BaseEngineOption {}

export interface AzureEngineOption extends BaseEngineOption {
  key: string;
  region: string;
}

export type EngineTranslateOptions = Omit<TranslateOptions, "engine">;

export type Engine = {
  name: string;
  translate: (text: string | string[], opts: EngineTranslateOptions) => Promise<string[]>;
};

export interface CacheRecord {
  value: unknown;
  timeout?: number;
  expire: number;
}

export interface Languages {
  [key: string]: string;
}
