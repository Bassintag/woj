import { mkdir, rm } from "node:fs/promises";
import pkg from "../package.json";

const releaseName = "woj-cli";

const targets = [
  { os: "linux", cpu: "x64" },
  { os: "linux", cpu: "arm64" },
  { os: "darwin", cpu: "x64" },
  { os: "darwin", cpu: "arm64" },
  { os: "win32", cpu: "x64", bunOs: "windows", ext: ".exe" },
] as const;

await rm("dist", { recursive: true, force: true });

const optionalDependencies: Record<string, string> = {};

for (const { os, cpu, ...rest } of targets) {
  const name = `${releaseName}-${os}-${cpu}`;
  optionalDependencies[name] = pkg.version;
  const dir = `dist/${os}-${cpu}`;
  const ext = "ext" in rest ? rest.ext : "";
  const bunOs = "bunOs" in rest ? rest.bunOs : os;

  await mkdir(`${dir}/bin`, { recursive: true });

  const result = await Bun.build({
    entrypoints: ["src/index.ts"],
    minify: true,
    compile: {
      target: `bun-${bunOs}-${cpu}` as Bun.Build.CompileTarget,
      outfile: `${dir}/bin/woj${ext}`,
    },
  });

  if (!result.success) {
    console.error(result.logs.join("\n"));
    process.exit(1);
  }

  await Bun.write(
    `${dir}/package.json`,
    JSON.stringify(
      {
        name,
        version: pkg.version,
        description: `${releaseName} binary for ${os}-${cpu}`,
        os: [os],
        cpu: [cpu],
        files: ["bin"],
        publishConfig: { access: "public" },
      },
      null,
      2,
    ),
  );

  console.log(`built ${name}`);
}

await mkdir("dist/cli/bin", { recursive: true });
const launcher = await Bun.build({
  entrypoints: ["launcher/woj.ts"],
  outdir: "dist/cli/bin",
  target: "node",
  minify: true,
  banner: "#!/usr/bin/env node",
});

if (!launcher.success) {
  console.error(launcher.logs.join("\n"));
  process.exit(1);
}
await Bun.write(
  "dist/cli/package.json",
  JSON.stringify(
    {
      name: releaseName,
      version: pkg.version,
      description: "Woj command line interface",
      type: "module",
      bin: { woj: "bin/woj.js" },
      files: ["bin"],
      optionalDependencies,
      publishConfig: { access: "public" },
    },
    null,
    2,
  ),
);
