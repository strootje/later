import * as clientDb from "@scope/db/client";
import { hydrateStart, StartClient } from "@tanstack/solid-start/client";
import { hydrate } from "solid-js/web";

(async () => {
  await clientDb.migrateToLatest();
  const router = await hydrateStart();
  hydrate(() => <StartClient router={router} />, document);
})();
