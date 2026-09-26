import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: Bun.env.DB_FILE_PATH as string,
  },
});
