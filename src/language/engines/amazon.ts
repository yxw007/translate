import amazonTargetLanguages from "../target/amazon";

export const amazonLanguages = {
  from: {
    Auto: "auto",
    ...amazonTargetLanguages,
  },
  to: amazonTargetLanguages,
} as const;

export default amazonLanguages;
