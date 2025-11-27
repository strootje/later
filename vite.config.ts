import deno from "@deno/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import sqlocal from "sqlocal/vite";
import uno from "unocss/vite";
import { defineConfig } from "vite";
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
    nitroV2Plugin({ preset: "deno-server" }),
    solid({ ssr: true }),
    sqlocal(),
    uno(),
    sentryVitePlugin({
      authToken: "5089b097a5de1ef1fe003ce0f26623e134a51d82",
      url: "https://bugs.strooware.nl",
      org: "does-not-matter",
      project: "later",
    }),
  ],
});
