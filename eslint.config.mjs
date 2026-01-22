import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import babelParser from "@babel/eslint-parser";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "plugins/**",
    ],
  },

  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
  react,
  "react-hooks": reactHooks,
  "react-refresh": reactRefresh,
},
rules: {
  ...js.configs.recommended.rules,
  ...react.configs.recommended.rules,
  ...reactHooks.configs.recommended.rules,

  // Modern React (no PropTypes required)
  "react/prop-types": "off",

  // React 17+ (no need to import React for JSX)
  "react/react-in-jsx-scope": "off",

  // Vite Fast Refresh rule (now that plugin is installed)
  "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

  // Make linting usable
  "react-hooks/purity": "off",
  "react/no-unescaped-entities": "off",
  "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
  "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
},

  },
];