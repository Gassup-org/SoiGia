import globals from "globals";

import base from "./base.mjs";

export default [
  ...base,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      "no-process-exit": "error"
    }
  }
];
