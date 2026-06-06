import { useClientDb, useLiveQuery } from "@scope/db/client";
import { createClientOnlyFn } from "@tanstack/solid-start";
import { nanoid } from "nanoid";

export const getAll = createClientOnlyFn(() => {
  return useLiveQuery(({ db }) => db.selectFrom("item").selectAll());
});

export const insert = createClientOnlyFn(async (dueAt: string) => {
  const db = useClientDb();

  return await db.insertInto("item")
    .values({
      id: nanoid(),
      title: nanoid(),
      dueAt,
    })
    .execute();
});

export const remove = createClientOnlyFn(async (id: string) => {
  const db = useClientDb();

  return await db.deleteFrom("item")
    .where("id", "=", id)
    .executeTakeFirst();
});

export const postpone = createClientOnlyFn(async (id: string, dueAt: string) => {
  const db = useClientDb();

  return await db.updateTable("item")
    .set("dueAt", dueAt).where("id", "=", id)
    .executeTakeFirst();
});

export const complete = createClientOnlyFn(async (id: string, completedAt?: string) => {
  const db = useClientDb();

  return await db.updateTable("item")
    .set("completedAt", completedAt).where("id", "=", id)
    .executeTakeFirst();
});
