import * as Sentry from "@sentry/solid";
import { tanstackRouterBrowserTracingIntegration } from "@sentry/solid/tanstackrouter";
import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "./route-tree.gen.ts";

export const getRouter = () => {
  const router = createRouter({
    scrollRestoration: true,
    routeTree,
  });

  Sentry.init({
    enabled: !import.meta.env.DEV,
    dsn: "https://4df4a269345645a1b8b1770765af44ff@bugs.strooware.nl/1",
    integrations: [tanstackRouterBrowserTracingIntegration(router as any)],
    tracesSampleRate: 1.0,
  });

  return router;
};
