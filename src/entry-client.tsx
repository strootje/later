import { clientDb } from "@scope/database/client";
import { SentryErrorBoundary } from "@strootje/more/sentry";
import { hydrateStart, StartClient } from "@tanstack/solid-start/client";
import { hydrate } from "solid-js/web";

hydrateStart().then(async (router) => {
  await clientDb.migrateToLatest();

  hydrate(() => (
    <SentryErrorBoundary fallback={<p>error..</p>}>
      <StartClient router={router} />
    </SentryErrorBoundary>
  ), document.body);
});
