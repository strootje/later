import deno from "@deno/vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nanoid } from "nanoid";
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
      disable: mode === "development",
      strategies: "generateSW",
      registerType: "autoUpdate",

      // srcDir: "src",
      // filename: "entry-sw.ts",
      outDir: ".output/public",

      manifest: {
        name: "Notes for Later",
        short_name: "later",
        description: "A Notes app that helps you keep track at notes for later",
        theme_color: "#ff00f0",
      },

      pwaAssets: {
        disabled: mode === "development",
        integration: {
          outDir: ".output/public",
        },
      },

      workbox: {
        globDirectory: ".output/public",
        globPatterns: ["**/*.{css,html,ico,js,png,svg,wasm}"],
        navigateFallback: "_shell.html",
        additionalManifestEntries: [
          { url: "_shell.html", revision: nanoid() },
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
  ],
  resolve: {
    dedupe: [
      "solid-js",
      "solid-js/web",
      "solid-js/store",
    ],
  },
}));
