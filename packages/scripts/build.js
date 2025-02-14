import * as fs from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";

const srcPath = path.join(import.meta.dirname, "src");
const outPath = path.join(import.meta.dirname, "dist");
const entryPoints = [];

for (const entry of fs.readdirSync(srcPath)) {
  if (!entry.endsWith(".ts")) continue;
  entryPoints.push(path.join(srcPath, entry));
}

esbuild.buildSync({
  entryPoints,
  outdir: outPath,
  bundle: true,
  minify: true,
  packages: "external",
  platform: "node",
  target: "node22",
  format: "esm",
});
