import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
	plugins: [
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		react(),
		tailwindcss(),
		checker({ typescript: true }),
	],
	envDir: "../..",
	envPrefix: "PUBLIC_",
	resolve: {
		alias: {
			"@": path.join(import.meta.dirname, "src"),
		},
	},
});
