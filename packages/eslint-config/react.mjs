import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

import base from "./base.mjs";

export default [
  ...base,
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  }
];
