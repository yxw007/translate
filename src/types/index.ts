import { Language } from "@/language";

export interface TranslateOptions {
  from: Language;
  to: Language;
  engine?: string;
  cache_time?: number;
  domain?: string;
}

export interface BaseEngineOption {}

export interface AzureEngineOption extends BaseEngineOption {
  key: string;
  region: string;
}

export interface AmazonEngineOption extends BaseEngineOption {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface YandexEngineOption extends BaseEngineOption {
  key: string;
}

export interface BaiduEngineOption extends BaseEngineOption {
  appId: string;
  secretKey: string;
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
