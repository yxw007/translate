import googleTargetLanguages from "../target/google";

export const openaiLanguages = {
  from: {
    Auto: "auto",
    ...googleTargetLanguages,
  },
  to: googleTargetLanguages,
} as const;

export default openaiLanguages;
