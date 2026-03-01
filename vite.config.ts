import deno from "@deno/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import sqlocal from "sqlocal/vite";
import uno from "unocss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { pwa } from "./pwa.config.ts";

export default defineConfig({
  build: {
    sourcemap: true,
  },

  plugins: [
    deno(),
    tanstackStart({
      client: {
        entry: "entry-client.tsx",
      },
      router: {
        addExtensions: true,
        generatedRouteTree: "route-tree.gen.ts",
        quoteStyle: "double",
      },
      server: {
        entry: "entry-server.ts",
      },
    }),
    nitroV2Plugin({
      preset: "deno-server",
      compatibilityDate: "2025-11-29",
    }),
    solid({ ssr: true }),
    sqlocal(),
    uno(),
    pwa(),
    sentryVitePlugin({
      authToken: Deno.env.get("SENTRY_TOKEN"),
      url: "https://bugs.strooware.nl",
      org: "does-not-matter",
      project: "app-later",
    }),
  ],

  server: {
    proxy: {
      "/api/event": "https://stats.strooware.nl",
    },
  },
});
