import { clientDb } from "@scope/database/client";
import { singleQueryClient } from "@strootje/more/query";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/solid-db";

export const todoItemCollection = createCollection(queryCollectionOptions({
  queryClient: singleQueryClient(),
  queryKey: ["local:todos"],
  getKey: (item) => item.id,

  queryFn: async () => {
    const db = clientDb.useDatabase();
    return await db.selectFrom("todos").selectAll().execute();
  },

  onInsert: async ({ transaction }) => {
    const db = clientDb.useDatabase();
    const { modified } = transaction.mutations[0];
    await db.insertInto("todos").values(modified)
      .execute();
  },

  onUpdate: async ({ transaction }) => {
    const db = clientDb.useDatabase();
    const { modified } = transaction.mutations[0];
    await db.updateTable("todos")
      .set("completedAt", modified.completedAt)
      .set("dueAt", modified.dueAt)
      .where("id", "==", modified.id)
      .execute();
  },

  onDelete: async ({ transaction }) => {
    const db = clientDb.useDatabase();
    const { original } = transaction.mutations[0];
    await db.deleteFrom("todos")
      .where("id", "==", original.id)
      .execute();
  },
}));
