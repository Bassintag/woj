import { z } from "zod";

const EnvSchema = z.object({
  DB_FILE_PATH: z.string(),
  IMAGES_DIRECTORY: z.string(),
  MIGRATIONS_DIRECTORY: z.string().default("../../packages/db/migrations"),
  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  API_KEY: z.string().optional(),
});

export function createEnv() {
  return EnvSchema.parse(Bun.env);
}

export type Env = ReturnType<typeof createEnv>;
