import type { Migration } from "kysely";

export const server_m001_initial: Migration = {
  async up({ schema }) {
    await schema
      .createTable("user")
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("name", "text", (col) => col.notNull())
      .addColumn("email", "text", (col) => col.notNull())
      .addColumn("emailVerified", "integer", (col) => col.notNull().defaultTo(0))
      .addColumn("image", "text")
      .addColumn("createdAt", "integer", (col) => col.notNull())
      .addColumn("updatedAt", "integer", (col) => col.notNull())
      .addColumn("role", "text")
      .addColumn("banned", "integer")
      .addColumn("banReason", "text")
      .addColumn("banExpires", "integer")
      .execute();

    await schema
      .createIndex("user_email_idx")
      .on("user")
      .column("email")
      .execute();

    await schema
      .createTable("session")
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("userId", "text", (col) => col.notNull().references("user.id").onDelete("cascade"))
      .addColumn("token", "text", (col) => col.notNull().unique())
      .addColumn("expiresAt", "integer", (col) => col.notNull())
      .addColumn("ipAddress", "text")
      .addColumn("userAgent", "text")
      .addColumn("createdAt", "integer", (col) => col.notNull())
      .addColumn("updatedAt", "integer", (col) => col.notNull())
      .addColumn("impersonatedBy", "text")
      .execute();

    await schema
      .createIndex("session_user_id_idx")
      .on("session")
      .column("userId")
      .execute();

    await schema
      .createIndex("session_token_idx")
      .on("session")
      .column("token")
      .execute();

    await schema
      .createTable("account")
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("userId", "text", (col) => col.notNull().references("user.id").onDelete("cascade"))
      .addColumn("accountId", "text", (col) => col.notNull())
      .addColumn("providerId", "text", (col) => col.notNull())
      .addColumn("accessToken", "text")
      .addColumn("refreshToken", "text")
      .addColumn("accessTokenExpiresAt", "integer")
      .addColumn("refreshTokenExpiresAt", "integer")
      .addColumn("scope", "text")
      .addColumn("idToken", "text")
      .addColumn("password", "text")
      .addColumn("createdAt", "integer", (col) => col.notNull())
      .addColumn("updatedAt", "integer", (col) => col.notNull())
      .execute();

    await schema
      .createIndex("account_user_id_idx")
      .on("account")
      .column("userId")
      .execute();

    await schema
      .createTable("verification")
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("identifier", "text", (col) => col.notNull())
      .addColumn("value", "text", (col) => col.notNull())
      .addColumn("expiresAt", "integer", (col) => col.notNull())
      .addColumn("createdAt", "integer", (col) => col.notNull())
      .addColumn("updatedAt", "integer", (col) => col.notNull())
      .execute();

    await schema
      .createIndex("verification_identifier_idx")
      .on("verification")
      .column("identifier")
      .execute();

    await schema
      .createTable("passkey")
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("name", "text")
      .addColumn("publicKey", "text", (col) => col.notNull())
      .addColumn("userId", "text", (col) => col.notNull().references("user.id").onDelete("cascade"))
      .addColumn("credentialID", "text", (col) => col.notNull())
      .addColumn("counter", "integer", (col) => col.notNull())
      .addColumn("deviceType", "text", (col) => col.notNull())
      .addColumn("backedUp", "integer", (col) => col.notNull())
      .addColumn("transports", "text")
      .addColumn("createdAt", "integer")
      .addColumn("aaguid", "text")
      .execute();

    await schema
      .createIndex("passkey_user_id_idx")
      .on("passkey")
      .column("userId")
      .execute();
  },

  async down({ schema }) {
    await schema.dropIndex("passkey_user_id_idx").execute();
    await schema.dropIndex("verification_identifier_idx").execute();
    await schema.dropIndex("account_user_id_idx").execute();
    await schema.dropIndex("session_token_idx").execute();
    await schema.dropIndex("session_user_id_idx").execute();
    await schema.dropIndex("user_email_idx").execute();

    await schema.dropTable("passkey").execute();
    await schema.dropTable("verification").execute();
    await schema.dropTable("account").execute();
    await schema.dropTable("session").execute();
    await schema.dropTable("user").execute();
  },
};
