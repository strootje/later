import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";
import { pwaAssetsHead } from "virtual:pwa-assets/head";
import { pwaInfo } from "virtual:pwa-info";
import { useRegisterSW } from "virtual:pwa-register/solid";
import "virtual:uno.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charset: "utf-8",
      },
      {
        title: "later.app",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
    links: [
      ...pwaAssetsHead.links,
      pwaInfo?.webManifest && {
        useCredentials: pwaInfo.webManifest.useCredentials,
        href: pwaInfo.webManifest.href,
        rel: "manifest",
      },
    ],
  }),

  component: () => {
    useRegisterSW({
      immediate: true,
    });

    return (
      <html lang="en">
        <head>
          <HeadContent />
          <HydrationScript />
        </head>

        <body>
          <Outlet />
          <Scripts />
        </body>
      </html>
    );
  },

  notFoundComponent: ({ routeId }) => (
    <div>
      <h1>???ERROR NOT FOUND!!!</h1>
      <span>{routeId}</span>
    </div>
  ),
});
