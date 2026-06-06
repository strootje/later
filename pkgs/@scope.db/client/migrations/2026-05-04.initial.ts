import type { Migration } from "kysely/migration";

export default {
  up: async ({ schema }) => {
    await schema.createTable("item")
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("dueAt", "text", (col) => col.notNull())
      .addColumn("title", "text", (col) => col.notNull())
      .addColumn("completedAt", "text")
      .execute();
  },
} satisfies Migration;
