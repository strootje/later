import { makeDatabase } from "@jsr/strootje__better-kysely";
import { SQLocalKysely } from "sqlocal/kysely";
import { client_m001_initial } from "./migrations/client-001-initial.ts";
import type { ClientDatabase } from "./models/client.models.ts";

let sqlocal: SQLocalKysely;
const useSqlocal = () => {
  return sqlocal ??= new SQLocalKysely("later.sql");
};

const getDialect = () => {
  return useSqlocal().dialect;
};

export const clientDb = makeDatabase<ClientDatabase>(getDialect(), () => {
  return Promise.resolve({
    client_m001_initial,
  });
});
