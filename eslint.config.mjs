import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Archived legacy Vite app and the design prototype — not part of the build.
      "backup/**",
      "design/**",
    ],
  },
  {
    rules: {
      // Allow en-dash/em-dash and Bangla text in JSX strings.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
