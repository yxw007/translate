import { engines } from "./engines";
import { Engine, TranslateOptions, Engines } from "./types";
import { useLogger, Cache, getGapLine } from "./utils";
import { FromLanguage, getLanguage, normalFromLanguage, normalToLanguage, ToLanguage } from "./language";
export * from "./types";

const logger = useLogger();
const cache = new Cache();

class Translator {
  private engines: Map<string, Engine>;
  constructor() {
    this.engines = new Map<string, Engine>();
  }
  use(engine: Engine) {
    if (this.engines.has(engine.name)) {
      logger.warn("Engine already exists");
      return;
    }
    this.engines.set(engine.name, engine);
  }
  async translate<T extends Engines>(text: string | string[], options: TranslateOptions<T>): Promise<string[]> {
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
      return Promise.resolve(cache.get(key)?.value as string[]);
    }

    return engineInstance
      .translate(text, options)
      .then((translated) => {
        cache.set(key, translated, cache_time);
        return translated;
      })
      .catch((e) => {
        logger.error(
          `Translate Failed: from=${from},to=${to},engine=${engine},translate text: \n${getGapLine()}\n${text}\n${getGapLine()}\n error: ${e.message}`
        );
        throw e;
      });
  }
}

const translator = new Translator();

export default {
  engines,
  translator,
  Cache,
  getLanguage,
};
export { engines, translator, Cache, getLanguage };
