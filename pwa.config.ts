import { VitePWA } from "vite-plugin-pwa";

export const pwa = () => {
  return VitePWA({
    registerType: "autoUpdate",
    strategies: "injectManifest",
    filename: "entry-sw.ts",
    srcDir: "src",

    manifest: {
      name: "do it later",
      short_name: "later",
      theme_color: "#ff0000",
    },

    devOptions: {
      enabled: true,
      type: "module",
    },
  });
};
