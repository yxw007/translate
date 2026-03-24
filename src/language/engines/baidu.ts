import baiduTargetLanguages from "../target/baidu";

export const baiduLanguages = {
  from: {
    Auto: "auto",
    ...baiduTargetLanguages,
  },
  to: baiduTargetLanguages,
} as const;

export default baiduLanguages;
