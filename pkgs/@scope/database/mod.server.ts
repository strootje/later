import { Database as Sqlite } from "@jsr/db__sqlite";
import { DenoSqlite3Dialect } from "@jsr/soapbox__kysely-deno-sqlite";
import { makeDatabase } from "@jsr/strootje__better-kysely";
import type { Dialect } from "kysely";
import type { ServerDatabase } from "./server.models.ts";

let dialect: DenoSqlite3Dialect;
const getDialect = () => {
  return (dialect ??= new DenoSqlite3Dialect({
    database: new Sqlite("later-server.db"),
  })) as any as Dialect;
};

export const serverDb = makeDatabase<ServerDatabase>(getDialect(), () => Promise.resolve({}));
