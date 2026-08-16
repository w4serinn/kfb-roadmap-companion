import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["assets/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
      },
    },
  },
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        URL: "readonly",
      },
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
