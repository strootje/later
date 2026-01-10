import { clientDb } from "@scope/database/client";
import { singleQueryClient } from "@strootje/more/query";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/solid-db";
import { createClientOnlyFn } from "@tanstack/solid-start";
import { isServer } from "solid-js/web";

const useClientDatabase = createClientOnlyFn(() => {
  return clientDb.useDatabase();
});

export const todoItemCollection = createCollection(queryCollectionOptions({
  queryClient: singleQueryClient(),
  queryKey: ["local:todo:items"],
  getKey: (item) => item.id,

  queryFn: async () => {
    if (isServer) {
      return [];
    }

    const db = useClientDatabase();
    return await db.selectFrom("todos").selectAll().execute();
  },

  onInsert: async ({ transaction }) => {
    const db = useClientDatabase();
    const { modified } = transaction.mutations[0];
    await db.insertInto("todos").values(modified)
      .execute();
  },

  onUpdate: async ({ transaction }) => {
    const db = useClientDatabase();
    const { modified } = transaction.mutations[0];
    console.log("updating", modified);
    await db.updateTable("todos")
      .set("completedAt", modified.completedAt)
      .set("dueAt", modified.dueAt)
      .where("id", "==", modified.id)
      .execute();
  },

  onDelete: async ({ transaction }) => {
    const db = useClientDatabase();
    const { original } = transaction.mutations[0];
    await db.deleteFrom("todos")
      .where("id", "==", original.id)
      .execute();
  },
}));
