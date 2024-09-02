export interface TranslateOptions {
  from: string;
  to: string;
  engine?: string;
  cache_time?: number;
}

export interface EngineBaseOption {}

export type EngineTranslateOptions = Omit<TranslateOptions, "engine">;

export type Engine = {
  name: string;
  translate: (text: string, opts: EngineTranslateOptions) => Promise<string>;
};

export interface CacheRecord {
  value: unknown;
  timeout?: NodeJS.Timeout;
  expire: number;
}

export interface Languages {
  [key: string]: string;
}
