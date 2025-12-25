import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite 配置。
 * - `package.json` 使用 ESM（"type": "module"），因此不能直接使用 `__dirname`
 * - `build.outDir` 显式指定为 `dist`，与 Pages/本地预览保持一致
 */
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
