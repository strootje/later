import { createClientOnlyFn } from "@tanstack/solid-start";
import { type Compilable, Kysely } from "kysely";
import { type MigrationProvider, Migrator } from "kysely/migration";
import {
  // @ts-types="solid-js"
  Accessor,
  createResource, // @ts-types="solid-js"
  createSignal,
  onCleanup,
} from "solid-js";
import { SQLocalKysely } from "sqlocal/kysely";

type Database = {
  item: {
    id: string;
    dueAt: string;
    title: string;
  };
};

let sqlocal: SQLocalKysely;
const useSqlocal = createClientOnlyFn(() => {
  return sqlocal ??= new SQLocalKysely({
    databasePath: "later.db",
    reactive: true,
  });
});

let db: Kysely<Database>;
export const useClientDb = createClientOnlyFn(() => {
  return db ??= new Kysely<Database>({
    dialect: useSqlocal().dialect,
  });
});

export const useLiveQuery = createClientOnlyFn(
  <O extends Record<string, unknown>>(
    fn: (props: { db: Kysely<Database> }) => Compilable<O>,
  ): Accessor<O[] | undefined> => {
    const db = useClientDb();
    const { reactiveQuery } = useSqlocal();
    const [data, setData] = createSignal<O[] | undefined>();

    const [resource] = createResource(
      () => reactiveQuery(fn({ db }).compile()),
      (query) => {
        return new Promise<O[] | undefined>((resolve, reject) => {
          const { unsubscribe } = query.subscribe(
            (data) => resolve(setData(data)),
            (err) => reject(err),
          );

          onCleanup(unsubscribe);
        });
      },
    );

    return () => resource.loading ? resource() : data();
  },
);

export const migrateToLatest = createClientOnlyFn(async () => {
  const provider: MigrationProvider = {
    getMigrations: () => {
      return Promise.resolve(import.meta.glob("./migrations/*.ts", {
        import: "default",
        eager: true,
      }));
    },
  };

  const migrator = new Migrator({ db: useClientDb(), provider });
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach(({ direction, migrationName, status }) => {
    console.log("[migrator]", direction, status, migrationName);
  });

  if (error) {
    console.error("[migrator]", error);
  }
});
