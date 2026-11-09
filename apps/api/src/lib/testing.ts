import { join } from "node:path";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createDb } from "./db";

export async function createTestDb() {
  const db = createDb({ DB_FILE_PATH: ":memory:" } as never);
  await migrate(db, {
    migrationsFolder: join(
      import.meta.dir,
      "../../../../packages/db/migrations",
    ),
  });
  return db;
}
