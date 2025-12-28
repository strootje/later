import deno from "@deno/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import sqlocal from "sqlocal/vite";
import uno from "unocss/vite";
import { defineConfig, type Plugin } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  build: { sourcemap: true },
  server: { port: 3000 },

  plugins: [
    deno(),
    tanstackStart({
      router: {
        addExtensions: true,
        generatedRouteTree: "route-tree.gen.ts",
        quoteStyle: "double",
      },
    }),
    nitroV2Plugin({
      preset: "deno-server",
      compatibilityDate: "2025-11-29",
    }),
    solid({ ssr: true }),
    sqlocal(),
    uno(),
    sentryVitePlugin({
      authToken: Deno.env.get("SENTRY_TOKEN"),
      url: "https://bugs.strooware.nl",
      org: "does-not-matter",
      project: "app/later",
    }) as Plugin[],
  ],
});
