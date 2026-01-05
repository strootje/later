import type { Migration } from "kysely";

export const server_m002_add_subscriber_id: Migration = {
  async up({ schema }) {
    await schema.alterTable("user")
      .addColumn("subscriberId", "integer")
      .execute();
  },

  async down({ schema }) {
    await schema.alterTable("user")
      .dropColumn("subscriberId")
      .execute();
  },
};
