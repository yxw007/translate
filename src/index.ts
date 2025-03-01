import { engines } from "./engines";
import { Engine, TranslateOptions, Engines, TranslationError } from "./types";
import { useLogger, Cache, getGapLine, getErrorMessages, splitText, isOverMaxCharacterNum, sleep } from "./utils";
import { FromLanguage, getLanguage, normalFromLanguage, normalToLanguage, ToLanguage } from "./language";
import { appName, defaultMaxCharacterNum } from "./utils/constant";
export * from "./types";

const logger = useLogger();
const cache = new Cache();

interface ConcurrencyTask {
  index: number;
  content: string;
}

interface TranslateTaskResult {
  index: number;
  translated: string[];
}

class Translator {
  private engines: Map<string, Engine>;
  private cache_time: number;
  private concurrencyMax: number;
  private concurrencyDelay: number;
  constructor(cache_time: number = 60 * 1000, concurrencyMax: number = 4, concurrencyDelay = 20) {
    this.engines = new Map<string, Engine>();
    this.cache_time = cache_time;
    this.concurrencyMax = concurrencyMax;
    this.concurrencyDelay = concurrencyDelay;
  }
  /**
   * This method is obsolete, please use the addEngine method
   * @param engine {@link Engine}  instance
   * @deprecated Use {@link addEngine} instead.
   */
  use(engine: Engine) {
    this.addEngine(engine);
  }
  addEngine(engine: Engine) {
    if (this.engines.has(engine.name)) {
      logger.warn("Engine already exists");
      return;
    }
    this.engines.set(engine.name, engine);
  }
  removeEngine(engineName: string) {
    if (!engineName || !this.engines.has(engineName)) {
      logger.warn("Engine name is required or not found");
      return false;
    }
    this.engines.delete(engineName);
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

    return this.concurrencyHandle(engineInstance, text, options)
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
  private async concurrencyHandle<T extends Engines>(
    engine: Engine,
    text: string | string[],
    options: TranslateOptions<T>
  ): Promise<string[]> {
    const { max_character_num = defaultMaxCharacterNum } = options;
    const maxCharacterNum: number = max_character_num > 0 ? max_character_num : defaultMaxCharacterNum;
    if (Array.isArray(text)) {
      if (isOverMaxCharacterNum(text, max_character_num)) {
        throw new TranslationError(
          appName,
          "String arrays do not support automatic character splitting, and the total number of characters in a string array exceeds the limit on the number of translated characters."
        );
      }
      return engine.translate(text, options);
    } else {
      return this.concurrencyTranslate(engine, text, options, maxCharacterNum);
    }
  }
  private async concurrencyTranslate<T extends Engines>(
    engine: Engine,
    text: string,
    options: TranslateOptions<T>,
    maxCharacterMum: number
  ): Promise<string[]> {
    const pendingTasks: ConcurrencyTask[] = splitText(text, maxCharacterMum).map(
      (content, index) => ({ content, index }) as ConcurrencyTask
    );
    const result: TranslateTaskResult[] = [];
    let activeTasks = 0;
    const concurrencyDelay = this.concurrencyDelay;
    const concurrencyMax = this.concurrencyMax;

    return new Promise((resolve, reject) => {
      function processTasks() {
        while (activeTasks < concurrencyMax && pendingTasks.length > 0) {
          const { content, index } = pendingTasks.shift()!;
          activeTasks++;

          engine
            .translate(content, options)
            .then((res) => {
              result.push({
                translated: res,
                index,
              });
            })
            .catch((error) => reject(error))
            .finally(async () => {
              activeTasks--;
              if (activeTasks === 0 && pendingTasks.length <= 0) {
                result.sort((a, b) => a.index - b.index);
                const arr = result.reduce<string[]>((pre, cur) => pre.concat(cur.translated), []);
                return resolve([arr.join("")]);
              }
              await sleep(concurrencyDelay);
              processTasks();
            });
        }
      }

      processTasks();

      return result;
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
