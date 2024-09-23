import { originLanguages, originLanguageMapNames, originLanguageMapValues } from "./origin";
import { targetLanguages, targetLanguageMapNames, targetLanguageMapValues } from "./target";
import { Engines } from "..";

export type KeysOfTarget<T extends keyof targetLanguageMapNames> = targetLanguageMapNames[T];
export type KeysOfOrigin<T extends keyof originLanguageMapNames> = originLanguageMapNames[T];

export type FromLanguage<T extends Engines> = KeysOfOrigin<T> | originLanguageMapValues[T] | "auto";
export type ToLanguage<T extends Engines> = KeysOfTarget<T> | targetLanguageMapValues[T];

export function normalFromLanguage<T extends Engines>(from: FromLanguage<T>, engine: Engines) {
  if (from === "auto") {
    return "auto";
  }

  const engineLanguages = originLanguages[engine];
  if (!engineLanguages) {
    throw new Error(`Engine ${engine} not found`);
  }

  const keys = Object.keys(originLanguages[engine]);
  if (keys.includes(from)) {
    return engineLanguages[from as keyof typeof engineLanguages];
  }

  const values = Object.values(originLanguages[engine]) as string[];
  if (values.includes(from)) {
    return from;
  }

  throw new Error(`Invalid from language ${engine} ${from}`);
}

export function normalToLanguage<T extends Engines>(to: ToLanguage<T>, engine: Engines) {
  const engineLanguages = targetLanguages[engine];
  if (!engineLanguages) {
    throw new Error(`Engine ${engine} not found`);
  }

  const keys = Object.keys(targetLanguages[engine]);
  if (keys.includes(to)) {
    return engineLanguages[to as keyof typeof engineLanguages];
  }

  const values = Object.values(targetLanguages[engine]) as string[];
  if (values.includes(to)) {
    return to;
  }

  throw new Error(`Invalid to language ${engine} ${to}`);
}

export function getLanguage(engine: Engines) {
  return {
    from: originLanguages[engine],
    to: targetLanguages[engine],
  };
}

export {
  originLanguages,
  originLanguageMapNames,
  originLanguageMapValues,
  targetLanguages,
  targetLanguageMapNames,
  targetLanguageMapValues,
};
