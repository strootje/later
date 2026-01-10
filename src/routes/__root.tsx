import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/solid-router";
import "@unocss/reset/tailwind.css";
import { HydrationScript } from "solid-js/web";
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
    <html>
      <head>
        <HeadContent />
        <HydrationScript />
      </head>

      <body>
        <Outlet />
        <AppBar />
        <Scripts />
      </body>
    </html>
  ),

  errorComponent: ({ error }) => {
    return <code>error: {error.message}</code>;
  },

  notFoundComponent: ({ routeId }) => {
    return <code>not found.. {routeId}</code>;
  },
});
