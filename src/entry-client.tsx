import { clientDb } from "@scope/database/client";
import { hydrateStart, StartClient } from "@tanstack/solid-start/client";
import { hydrate } from "solid-js/web";

hydrateStart().then(async (router) => {
  await clientDb.migrateToLatest();
  hydrate(() => <StartClient router={router} />, document);
});
