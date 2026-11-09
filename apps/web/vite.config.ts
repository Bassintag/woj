import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "WOJ",
        short_name: "WOJ",
        description:
          "Application de recettes self-hosted : recettes, menus, favoris, panier et liste de courses.",
        lang: "fr",
        display: "standalone",
        theme_color: "#ffb900",
        background_color: "#fbfaf9",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\//, /^\/images\//],
      },
    }),
    mode === "development" && checker({ typescript: true }),
  ],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/images": {
        target: "http://localhost:9000",
        rewrite: (path) => path.replace(/^\/images/, ""),
      },
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
