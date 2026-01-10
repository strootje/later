import { Database as Sqlite } from "@jsr/db__sqlite";
import { DenoSqlite3Dialect } from "@jsr/soapbox__kysely-deno-sqlite";
import { ensureDirSync } from "@jsr/std__fs";
import { dirname, join } from "@jsr/std__path";
import { makeDatabase } from "@jsr/strootje__better-kysely";
import type { Dialect } from "kysely";
import { server_m001_initial } from "./migrations/server-001-initial.ts";
import { server_m002_add_subscriber_id } from "./migrations/server-002-add-subscriber-id.ts";
import type { ServerDatabase } from "./models/server.models.ts";

let dialect: DenoSqlite3Dialect;
const getDialect = () => {
  const dbPath = join("/", "data", "later.server.db");
  ensureDirSync(dirname(dbPath));

  return (dialect ??= new DenoSqlite3Dialect({
    database: new Sqlite(dbPath),
  })) as any as Dialect;
};

export const serverDb = makeDatabase<ServerDatabase>(getDialect(), () => {
  return Promise.resolve({
    server_m001_initial,
    server_m002_add_subscriber_id,
  });
});

export const useDatabaseForBetterAuth = () => ({
  db: serverDb.useDatabase(),
  type: "sqlite",
});
