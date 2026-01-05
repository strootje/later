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
    dsn: "https://c50724d1a0d3498d843c7956d0ad2b70@bugs.strooware.nl/1",
    integrations: [tanstackRouterBrowserTracingIntegration(router as any)],
    tracesSampleRate: 1.0,
  });

  return router;
};
