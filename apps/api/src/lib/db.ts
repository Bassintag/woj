import { drizzle } from "drizzle-orm/libsql";

export function createDb() {
  return drizzle(process.env.DB_FILE_NAME!);
}
