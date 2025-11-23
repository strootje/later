import deno from "@deno/vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import uno from "unocss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  server: {
    port: 3000,
  },

  plugins: [
    deno(),
    tanstackStart({
      router: {
        addExtensions: true,
        generatedRouteTree: "route-tree.gen.ts",
        quoteStyle: "double",
      },
    }),
    solid({ ssr: true }),
    uno(),
  ],
});
