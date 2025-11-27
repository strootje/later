import { Kysely, Migrator } from "kysely";
import { onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { SQLocalKysely } from "sqlocal/kysely";
import { m001_initial } from "./migrations/001-initial.ts";
import type { ClientDatabase } from "./models.ts";

let sqlocal: SQLocalKysely;
const useSqlocal = () => {
  return sqlocal ??= new SQLocalKysely("later.sql");
};

let kysely: Kysely<ClientDatabase>;
export const useClientDatabase = () => {
  return kysely ??= new Kysely<ClientDatabase>({
    dialect: useSqlocal().dialect,
  });
};

export const MigrateToLatest = () => {
  onMount(async () => {
    if (isServer) {
      return;
    }

    const migrator = new Migrator({
      db: useClientDatabase(),
      provider: {
        getMigrations: () =>
          Promise.resolve({
            m001_initial,
          }),
      },
    });

    const { error, results } = await migrator.migrateToLatest();
    results?.forEach(({ direction, migrationName, status }) =>
      console.log(`[${direction}] ::: ${migrationName} - ${status}`)
    );
    if (error) throw error;
  });
  return null;
};
