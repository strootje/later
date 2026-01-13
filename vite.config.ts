import pluginDeno from "@deno/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import pluginSqlocal from "sqlocal/vite";
import pluginUno from "unocss/vite";
import { defineConfig, type Plugin } from "vite";
import pluginSolid from "vite-plugin-solid";
import { pluginPwa } from "./pwa.config.ts";

export default defineConfig({
  build: { sourcemap: true },
  server: { port: 3000 },

  plugins: [
    pluginDeno(),
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
    pluginSolid({ ssr: true }),
    pluginSqlocal() as Plugin,
    pluginUno(),
    pluginPwa(),
    sentryVitePlugin({
      authToken: Deno.env.get("SENTRY_TOKEN"),
      url: "https://bugs.strooware.nl",
      org: "does-not-matter",
      project: "app-later",
    }) as Plugin[],
  ],
});
