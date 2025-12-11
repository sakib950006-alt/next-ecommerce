import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // या जो भी domain तुम्हारी image का है
  },
}

const eslintConfig = [...compat.extends("next/core-web-vitals")];

export default eslintConfig;
