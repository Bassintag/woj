import { defineConfig, PluginOption } from "vite";
import viteReact from "@vitejs/plugin-react";
import viteChecker from "vite-plugin-checker";
import * as path from "node:path";

export default defineConfig((env) => {
  const plugins: PluginOption[] = [viteReact()];
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
