import { migrate } from "drizzle-orm/libsql/migrator";
import { createApp } from "./app";
import { createContext } from "./context";

const context = createContext();

await migrate(context.db, {
  migrationsFolder: context.env.MIGRATIONS_DIRECTORY,
});

const server = Bun.serve({ fetch: createApp(context) });

context.log.info(`Server listening on port ${server.port}`);
