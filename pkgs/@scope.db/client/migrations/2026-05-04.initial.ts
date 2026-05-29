import type { Migration } from "kysely";

export default {
  up: async ({ schema }) => {
    await schema.createTable("item")
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("dueAt", "text", (col) => col.notNull())
      .addColumn("title", "text", (col) => col.notNull())
      .execute();
  },
} satisfies Migration;
