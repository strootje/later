import { createServerOnlyFn } from "@tanstack/solid-start";

const load = <T = string>(key: string, defval?: T) => {
  const val = Deno.env.get(key);

  if (!val && !defval && val !== defval) {
    throw `missing env '${key}'`;
  }

  if (!val && defval) {
    return defval;
  }

  return val as T;
};

export const env = createServerOnlyFn(() => ({
  database: {
    path: load("DATABASE_PATH", "."),
  },
  fider: {
    token: load("FIDER_API_TOKEN"),
  },
  listmonk: {
    login: load("LISTMONK_API_LOGIN", "later"),
    token: load("LISTMONK_API_TOKEN"),
  },
  smtp: {
    host: load<string | undefined>("SMTP_HOST", undefined),
    port: load("SMTP_PORT", 1025),
  },
}));
