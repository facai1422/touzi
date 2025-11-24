import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // 允许使用 <img> 标签（因为项目中有很多图片）
      "@next/next/no-img-element": "off",
      // 允许未使用的变量（开发阶段）
      "@typescript-eslint/no-unused-vars": "warn",
      // 允许 React Hook 依赖警告
      "react-hooks/exhaustive-deps": "warn",
      // 保持严格的错误检查
      "@typescript-eslint/no-explicit-any": "error",
      "react/no-unescaped-entities": "error",
      "@next/next/no-html-link-for-pages": "error",
    },
  },
];

export default eslintConfig;
