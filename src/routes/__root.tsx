import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/solid-router";
import type { ParentProps } from "solid-js";
import { HydrationScript } from "solid-js/web";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  }),

  component: () => (
    <RootDocument>
      <QueryClientProvider client={new QueryClient()}>
        <Outlet />
      </QueryClientProvider>
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
      <Scripts />
    </body>
  </html>
);
