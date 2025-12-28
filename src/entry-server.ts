import { serverDb } from "@scope/database/server";
import handler, { createServerEntry } from "@tanstack/solid-start/server-entry";

await serverDb.migrateToLatest();
export default createServerEntry({
  fetch: (request) => handler.fetch(request),
});
