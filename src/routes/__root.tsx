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

  component: () => {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    );
  },
});

const RootDocument = ({ children }: ParentProps) => (
  <html>
    <head>
      <HydrationScript />
    </head>

    <body>
      <HeadContent />
      {children}
      <Scripts />
    </body>
  </html>
);
