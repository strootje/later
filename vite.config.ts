import deno from "@deno/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nitro } from "nitro/vite";
import sqlocal from "sqlocal/vite";
import uno from "unocss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solid from "vite-plugin-solid";

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: true,
    outDir: ".output/public",
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
        semicolons: true,
      },
      spa: {
        enabled: true,
      },
    }),
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      // filename: "entry-sw.ts",
      // srcDir: "src",

      integration: {
        closeBundleOrder: "pre",
      },

      manifest: {
        name: "Notes for Later",
        short_name: "later",
        description: "A Notes app that helps you keep track at notes for later",
        theme_color: "#fdf2f8",
        background_color: "#265456",
      },

      pwaAssets: {
        disabled: mode === "development",
        config: "pwa-assets.config.ts",
      },

      workbox: {
        globPatterns: ["**/*.{css,ico,js,png,svg,wasm}"],
        navigateFallback: "_shell.html",
        navigateFallbackDenylist: [
          /^\/_serverFn\//,
          /^\/api\//,
        ],
        additionalManifestEntries: [
          { url: "_shell.html", revision: new Date().toISOString() },
        ],
      },
    }),
    uno(),
    nitro({
      compatibilityDate: "latest",
      preset: "deno-server",
    }),
    solid({
      ssr: true,
    }),
    sqlocal(),
    sentryVitePlugin({
      authToken: Deno.env.get("SENTRY_TOKEN"),
      url: "https://bugs.strooware.nl",
      org: "does-not-matter",
      project: "app-later",
    }),
  ],
  resolve: {
    dedupe: [
      "solid-js",
      "solid-js/web",
      "solid-js/store",
    ],
  },
}));
