import { init } from "@plausible-analytics/tracker";
import { clientDb } from "@scope/db/client";
import { hydrateStart, StartClient } from "@tanstack/solid-start/client";
import { hydrate } from "solid-js/web";

hydrateStart().then(async (router) => {
  await clientDb.migrateToLatest();

  init({
    endpoint: "/api/event",
    captureOnLocalhost: true,
    domain: "later.nl",
  });

  hydrate(() => <StartClient router={router} />, document);
});
