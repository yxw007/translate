import azure from "../target/azure";
import google from "../target/google";
import baidu from "../target/baidu";
import deepl from "./deepl";
import amazon from "../target/amazon";
import openai from "../target/google";
import { ValuesOf } from "../../types/typescript";

export const originLanguages = {
  azure: azure,
  google: google,
  baidu: baidu,
  deepl: deepl,
  amazon: amazon,
  openai: openai,
} as const;

export type originLanguageMapNames = {
  amazon: keyof typeof amazon;
  azure: keyof typeof azure;
  google: keyof typeof google;
  baidu: keyof typeof baidu;
  deepl: keyof typeof deepl;
  openai: keyof typeof openai;
};

export type originLanguageMapValues = {
  amazon: ValuesOf<typeof amazon>;
  azure: ValuesOf<typeof azure>;
  google: ValuesOf<typeof google>;
  baidu: ValuesOf<typeof baidu>;
  deepl: ValuesOf<typeof deepl>;
  openai: ValuesOf<typeof openai>;
};
