import azureTargetLanguages from "../target/azure";

export const azureLanguages = {
  from: {
    Auto: "auto",
    ...azureTargetLanguages,
  },
  to: azureTargetLanguages,
} as const;

export default azureLanguages;
