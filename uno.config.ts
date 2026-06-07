import { presetSafeArea } from "@yeungkc/unocss-preset-safe-area";
import { defineConfig, Preset, presetIcons, presetWind4 } from "unocss";

export default defineConfig({
  presets: [
    presetWind4(),
    presetSafeArea() as Preset,
    presetIcons({
      collections: {
        solar: () => import("@iconify-json/solar/icons.json", { with: { type: "json" } }).then((p) => p.default),
      },
    }),
  ],
});
