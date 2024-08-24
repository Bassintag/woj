import { defineConfig, PluginOption } from "vite";
import viteReact from "@vitejs/plugin-react";
import viteChecker from "vite-plugin-checker";
import * as path from "node:path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig((env) => {
  const plugins: PluginOption[] = [
    viteReact(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
      ],
      manifest: {
        name: "Woj",
        short_name: "Woj",
        description: "Découvrez de nouvelles recettes avec Woj !",
        theme_color: "#ffffff",
        lang: "fr",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ];
  if (env.command !== "build") {
    plugins.push(viteChecker({ typescript: true }));
  }
  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    envPrefix: "PUBLIC_",
    envDir: path.resolve(__dirname, "../.."),
  };
});
