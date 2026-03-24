import { LanguageMap } from "../types";

export function normalizeEngineLanguage(language: string | undefined, languages: LanguageMap, allowAuto = false) {
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
