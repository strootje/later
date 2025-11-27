import { useClientDatabase } from "@scope/database/client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useQueryClient } from "@tanstack/solid-query";

export const createTodoCollectionOptions = () => {
  return queryCollectionOptions({
    queryClient: useQueryClient(),
    queryKey: ["local:todos"],
    getKey: (item) => item.id,

    queryFn: async () => {
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
      await db.updateTable("todos").set("completedAt", modified.completedAt)
        .where("id", "==", modified.id)
        .execute();
    },
  });
};
