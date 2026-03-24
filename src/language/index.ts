import type { Engine, Engines, FromLanguage, LanguageMap, ToLanguage } from "../types";
import { builtinEngineLanguages, type BuiltinEngineLanguageMap } from "./engines";
export * from "./check";

function normalizeLanguage(language: string | undefined, languages: LanguageMap, allowAuto = false) {
  if (!language) {
    return allowAuto ? "auto" : "";
  }

  if (allowAuto && language === "auto") {
    return "auto";
  }

  const entries = Object.entries(languages) as Array<[string, string]>;
  const matchedByKey = entries.find(([name]) => name.toLowerCase() === language.toLowerCase());
  if (matchedByKey) {
    return matchedByKey[1];
  }

  const matchedByValue = entries.find(([, value]) => value.toLowerCase() === language.toLowerCase());
  if (matchedByValue) {
    return matchedByValue[1];
  }

  return "";
}

function resolveLanguageSource(engine: Engines | Engine) {
  if (typeof engine === "string") {
    const languages = builtinEngineLanguages[engine] as BuiltinEngineLanguageMap[Engines] | undefined;
    if (!languages) {
      throw new Error(`Engine ${engine} not found`);
    }
    return languages;
  }

  return {
    from: engine.getFromLanguages(),
    to: engine.getToLanguages(),
  };
}

export function getLanguage<T extends Engines>(engine: T): BuiltinEngineLanguageMap[T];
export function getLanguage(engine: Engine): { from: LanguageMap; to: LanguageMap };
export function getLanguage(engine: Engines | Engine) {
  const languages = resolveLanguageSource(engine);
  return {
    from: languages.from,
    to: languages.to,
  };
}
