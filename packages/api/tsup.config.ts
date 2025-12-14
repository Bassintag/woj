import { defineConfig } from 'tsup';

export default defineConfig(({ watch }) => ({
  entry: ['./src/main.ts'],
  format: ['esm'],
  outDir: 'dist',
  platform: 'node',
  target: 'node20',
  sourcemap: true,
  clean: true,
  noExternal: ['@woj/common'],
  onSuccess: watch ? 'node dist/main.mjs' : undefined,
}));
