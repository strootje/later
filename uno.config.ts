import { presetSafeArea } from "@yeungkc/unocss-preset-safe-area";
import { defineConfig, type Preset, presetIcons, presetWebFonts, presetWind4 } from "unocss";
import { presetScrollbar } from "unocss-preset-scrollbar";

export default defineConfig({
  theme: {
    colors: {
      "brand-50": "oklch(0.95 0.035 90)",
      "brand-100": "oklch(0.90 0.035 90)",
      "brand-150": "oklch(0.85 0.035 90)",
      "brand-200": "oklch(0.80 0.035 90)",
      "brand-300": "oklch(0.70 0.035 90)",
      "brand-400": "oklch(0.60 0.035 90)",
      "brand-500": "oklch(0.50 0.035 90)",
      "brand-600": "oklch(0.40 0.035 90)",
      "brand-700": "oklch(0.30 0.035 90)",
      "brand-800": "oklch(0.20 0.035 90)",
      "brand-900": "oklch(0.10 0.035 90)",
    },
  },

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
