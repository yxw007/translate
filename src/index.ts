import { engines } from "./engines";
import { Engine, TranslateOptions, Engines } from "./types";
import { useLogger, Cache } from "./utils";
import { FromLanguage, getLanguage, normalFromLanguage, normalToLanguage, ToLanguage } from "./language";
export * from "./types";

const logger = useLogger();
const cache = new Cache();

class Translator {
  private engines: Map<string, Engine>;
  private cache_time: number;
  constructor(cache_time: number = 60 * 1000) {
    this.engines = new Map<string, Engine>();
    this.cache_time = cache_time;
  }
  use(engine: Engine) {
    if (this.engines.has(engine.name)) {
      logger.warn("Engine already exists");
      return;
    }
    this.engines.set(engine.name, engine);
  }
  translate<T extends Engines>(text: string | string[], options: TranslateOptions<T>) {
    const { engine = "google", cache_time = 60 * 1000 } = options;
    let { from = "auto", to } = options;
    from = options.from = normalFromLanguage(from, engine) as FromLanguage<T>;
    to = options.to = normalToLanguage(to, engine) as ToLanguage<T>;

    //1. Check if engine exists
    if (!this.engines.has(engine)) {
      throw new Error(`Engine ${engine} not found`);
    }

    const engineInstance = this.engines.get(engine);
    if (!engineInstance) {
      throw new Error(`Engine ${engine} not found`);
    }

    if (!from) {
      throw new Error(`Invalid origin language ${from as string}`);
    }
    if (!to) {
      throw new Error(`Invalid target language ${to as string}`);
    }

    const key = `${from as string}:${to as string}:${engine}:${text}`;
    //3. If the cache is matched, the cache is used directly
    if (cache.get(key)) {
      return Promise.resolve(cache.get(key)?.value);
    }

    return engineInstance.translate(text, options).then((translated) => {
      cache.set(key, translated, cache_time ?? this.cache_time);
      return translated;
    });
  }
}

const translator = new Translator();

export default {
  engines,
  translator,
  Translator,
  Cache,
  getLanguage,
};
export { engines, translator, Cache, getLanguage };
