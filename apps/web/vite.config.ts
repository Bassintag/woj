import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    mode === "development" && checker({ typescript: true }),
  ],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/images": "http://localhost:9000",
    },
  },
  envDir: "../..",
  envPrefix: "PUBLIC_",
  resolve: {
    alias: {
      "@": path.join(import.meta.dirname, "src"),
    },
  },
}));
