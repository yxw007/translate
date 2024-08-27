import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: [
      "src/**/*.{ts}",
      "script/**/*.{ts}",
      "test/**/*.{ts}",
    ],
  },
  {
    ignores: ["dist/**/*"]
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
