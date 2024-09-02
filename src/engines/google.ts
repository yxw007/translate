import { EngineBaseOption, EngineTranslateOptions } from "@/types";

export default function Google(options?: EngineBaseOption) {
  return {
    name: "google",
    async translate(text: string, opts: EngineTranslateOptions): Promise<string> {
      return text;
    },
  };
}
