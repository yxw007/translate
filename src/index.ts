import engines from "./engines";
import language from "./language";
import { useLogger, Cache } from "./utils";
import { Engine, TranslateOptions } from "./types";

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
  translate(text: string | string[], options: TranslateOptions) {
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

const translator = new Translator();

export default {
  engines,
  translator,
};
export { engines, translator, Cache };
