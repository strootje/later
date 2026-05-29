import { defineConfig, presetIcons, presetWind4 } from "unocss";

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      collections: {
        solar: () => import("@iconify-json/solar/icons.json", { with: { type: "json" } }).then((p) => p.default),
      },
    }),
  ],
});
