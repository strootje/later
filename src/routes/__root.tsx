import { SentryErrorBoundary, SimpleErrorDisplay } from "@strootje/more/sentry";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/solid-router";
import type { ParentProps } from "solid-js";
import { HydrationScript } from "solid-js/web";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import { AppBar } from "../comps/app-bar.tsx";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width,initial-scale=1,viewport-fit=cover" },
    ],
  }),

  component: () => (
    <RootDocument>
      <SentryErrorBoundary fallback={SimpleErrorDisplay}>
        <QueryClientProvider client={new QueryClient()}>
          <Outlet />
        </QueryClientProvider>
      </SentryErrorBoundary>
    </RootDocument>
  ),
});

const RootDocument = ({ children }: ParentProps) => (
  <html>
    <head>
      <HeadContent />
      <HydrationScript />
    </head>

    <body>
      {children}
      <AppBar />
      <Scripts />
    </body>
  </html>
);
