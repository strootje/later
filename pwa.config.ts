import { VitePWA } from "vite-plugin-pwa";

export const pluginPwa = () => {
  return VitePWA({
    registerType: "autoUpdate",
    strategies: "injectManifest",
    filename: "entry-sw.ts",
    srcDir: "src",

    manifest: false,

    devOptions: {
      enabled: true,
      type: "module",
    },
  });
};
