import { AppBar } from "#/components/shell-app-bar.tsx";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";
import { registerSW } from "virtual:pwa-register";
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
});
