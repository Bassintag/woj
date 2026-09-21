import { z } from "zod";

const EnvSchema = z.object({
  DB_FILE_PATH: z.string(),
});

export function createEnv() {
  return EnvSchema.parse(Bun.env);
}

export type Env = ReturnType<typeof createEnv>;
