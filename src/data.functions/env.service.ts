import { createServerOnlyFn } from "@tanstack/solid-start";

export const env = createServerOnlyFn(() => ({
  fider: {
    token: () => Deno.env.get("FIDER_API_TOKEN"),
  },
  listmonk: {
    login: () => Deno.env.get("LISTMONK_API_LOGIN") ?? "later",
    token: () => Deno.env.get("LISTMONK_API_TOKEN"),
  },
  databasePath: () => Deno.env.get("DATABASE_PATH") ?? ".",
}));
