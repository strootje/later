import { presetSafeArea } from "@yeungkc/unocss-preset-safe-area";
import { defineConfig, type Preset, presetIcons, presetWebFonts, presetWind4 } from "unocss";
import { presetScrollbar } from "unocss-preset-scrollbar";

export default defineConfig({
  presets: [
    presetWind4(),
    presetScrollbar(),
    presetSafeArea() as Preset,

    presetWebFonts({
      provider: "bunny",
      fonts: {},
    }),

    presetIcons({
      extraProperties: {
        "display": "inline-block",
        "vertical-align": "middle",
      },

      collections: {
        solar: () => import("@iconify-json/solar/icons.json", { with: { type: "json" } }).then((p) => p.default),
      },
    }),
  ],
});
