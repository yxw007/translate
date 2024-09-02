import { EngineBaseOption, EngineTranslateOptions } from "@/types";

export default function Google(options?: EngineBaseOption) {
  const base = "https://translate.googleapis.com/translate_a/single";
  return {
    name: "google",
    async translate(text: string, opts: EngineTranslateOptions): Promise<string> {
      const { from, to } = opts;
      const url = `${base}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(text)}`;
      const res: Response = await fetch(url);
      const body = await (res as any).json();
      const translated = body && body[0] && body[0][0] && body[0].map((s: Array<any>) => s[0]).join("");
      if (!translated) {
        throw new Error("Translation not found");
      }
      return translated;
    },
  };
}
