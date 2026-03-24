import googleTargetLanguages from "../target/google";

export const googleLanguages = {
  from: {
    Auto: "auto",
    ...googleTargetLanguages,
  },
  to: googleTargetLanguages,
} as const;

export default googleLanguages;
