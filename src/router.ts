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
    dsn: "https://f7923fc9bb35424eb020a037de282ba3@bugs.strooware.nl/2",
    integrations: [tanstackRouterBrowserTracingIntegration(router as any)],
    tracesSampleRate: 1.0,
  });

  return router;
};
