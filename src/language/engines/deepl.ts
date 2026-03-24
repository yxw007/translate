import deeplOriginLanguages from "../origin/deepl";
import deeplTargetLanguages from "../target/deepl";

export const deeplLanguages = {
  from: {
    Auto: "auto",
    ...deeplOriginLanguages,
  },
  to: deeplTargetLanguages,
} as const;

export default deeplLanguages;
