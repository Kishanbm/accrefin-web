import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "/",
  envDir: path.resolve(dir, ".."),
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
});
