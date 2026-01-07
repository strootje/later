import { SentryErrorBoundary, SimpleErrorDisplay } from "@strootje/more/sentry";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/solid-router";
import type { ParentProps } from "solid-js";
import { HydrationScript } from "solid-js/web";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import { AppBar } from "../comps.ui.shell/app-bar.tsx";

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
        <Outlet />
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
