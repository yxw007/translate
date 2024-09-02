import engines from "./engines";
import language from "./language";
import { useLogger } from "./utils";
import { Engine, TranslateOptions } from "./types";
import cache from "./utils/cache";
const logger = useLogger();

class Translator {
  private engines: Map<string, Engine>;
  constructor() {
    this.engines = new Map<string, Engine>();
  }
  useEngine(engine: Engine) {
    if (this.engines.has(engine.name)) {
      logger.warn("Engine already exists");
      return;
    }
    this.engines.set(engine.name, engine);
  }
  translate(text: string, options: TranslateOptions) {
    const { from, to, engine = "google", cache_time = 60 } = options;

    //1. Check if engine exists
    if (!this.engines.has(engine)) {
      throw new Error(`Engine ${engine} not found`);
    }

    //2. Check if language exists
    if (!language(from)) {
      throw new Error(`Language ${from} not found`);
    }
    if (!language(to)) {
      throw new Error(`Language ${to} not found`);
    }

    const key = `${from}:${to}:${engine}:${text}`;
    const engineInstance = this.engines.get(engine);
    if (!engineInstance) {
      throw new Error(`Engine ${engine} not found`);
    }

    return engineInstance.translate(text, options).then((translated) => {
      cache.set(key, translated, cache_time);
      return translated;
    });
  }
}

export default new Translator();
export { engines, language as languages };
