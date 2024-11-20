import { engines, OpenAIModel } from "./engines";
import { Engine, TranslateOptions, Engines, TranslationError } from "./types";
import { useLogger, Cache, getGapLine, getErrorMessages } from "./utils";
import { FromLanguage, getLanguage, normalFromLanguage, normalToLanguage, ToLanguage } from "./language";
import { appName } from "./utils/constant";
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
  async translate<T extends Engines>(text: string | string[], options: TranslateOptions<T>): Promise<string[]> {
    const { engine = "google", cache_time = 60 * 1000 } = options;
    let { from = "auto", to } = options;
    from = options.from = normalFromLanguage(from, engine) as FromLanguage<T>;
    to = options.to = normalToLanguage(to, engine) as ToLanguage<T>;

    //1. Check if engine exists
    if (!this.engines.has(engine)) {
      throw new TranslationError(appName, `Engine ${engine} not found`);
    }

    const engineInstance = this.engines.get(engine);
    if (!engineInstance) {
      throw new TranslationError(appName, `Engine ${engine} not found`);
    }

    if (!from) {
      throw new TranslationError(appName, `Invalid origin language ${from as string}`);
    }
    if (!to) {
      throw new TranslationError(appName, `Invalid target language ${to as string}`);
    }

    const key = `${from as string}:${to as string}:${engine}:${text}`;
    //3. If the cache is matched, the cache is used directly
    if (cache.get(key)) {
      return Promise.resolve(cache.get(key)?.value as string[]);
    }

    return engineInstance
      .translate(text, options)
      .then((translated) => {
        cache.set(key, translated, cache_time ?? this.cache_time);
        return translated;
      })
      .catch((e) => {
        logger.error(
          `${appName} Failed: from=${from},to=${to},engine=${engine},translate text: \n${getGapLine()}\n${text}\n${getGapLine()}\n error: ${getErrorMessages(e)}`
        );
        if (e instanceof TranslationError) {
          throw e;
        } else {
          throw new TranslationError(appName, getErrorMessages(e));
        }
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
export { engines, translator, Translator, Cache, getLanguage };
