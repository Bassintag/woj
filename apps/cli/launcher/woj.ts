import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ext = process.platform === "win32" ? ".exe" : "";
const pkg = `@woj/cli-${process.platform}-${process.arch}`;

let binary: string;
try {
  binary = require.resolve(`${pkg}/bin/woj${ext}`);
} catch {
  console.error(
    `woj: no binary available for ${process.platform}-${process.arch} (missing ${pkg}). Reinstall without --no-optional.`,
  );
  process.exit(1);
}

const { status, error } = spawnSync(binary, process.argv.slice(2), {
  stdio: "inherit",
});

if (error) {
  console.error(error.message);
  process.exit(1);
}

process.exit(status ?? 1);
