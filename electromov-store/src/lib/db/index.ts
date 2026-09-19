import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";

export const hasDatabase = Boolean(connectionString);

declare global {
  // eslint-disable-next-line no-var
  var __em_sql__: ReturnType<typeof postgres> | undefined;
}

function client() {
  if (!globalThis.__em_sql__) {
    globalThis.__em_sql__ = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      prepare: false,
      ssl: connectionString.includes("sslmode=disable") ? false : "require",
    });
  }
  return globalThis.__em_sql__;
}

export const db = hasDatabase ? drizzle(client(), { schema }) : null;
export { schema };
