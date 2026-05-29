import { useClientDb, useLiveQuery } from "@scope/db/client";
import { createClientOnlyFn } from "@tanstack/solid-start";
import { nanoid } from "nanoid";

export const getAll = createClientOnlyFn(() => {
  return useLiveQuery(({ db }) => db.selectFrom("item").selectAll());
});

export const insert = createClientOnlyFn(async (dueAt: string) => {
  const db = useClientDb();

  return await db.insertInto("item").values({
    id: nanoid(),
    title: nanoid(),
    dueAt,
  }).execute();
});
