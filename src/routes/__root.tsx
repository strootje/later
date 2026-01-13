import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";
import { registerSW } from "virtual:pwa-register";
import { AppBar } from "../comps.ui.shell/app-bar.tsx";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

registerSW({
  immediate: true,

  onRegisterError(error) {
    console.error("onRegisterError", error);
  },
});

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
