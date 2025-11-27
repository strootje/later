import type { Migration } from "kysely";

export const m001_initial: Migration = {
  async up({ schema }) {
    await schema.createTable("todos")
      .addColumn("id", "uuid", (p) => p.unique().notNull())
      .addColumn("title", "text", (p) => p.notNull())
      .addColumn("dueAt", "date", (p) => p.notNull())
      .addColumn("completedAt", "datetime")
      .execute();
  },
};
