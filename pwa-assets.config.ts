import { combinePresetAndAppleSplashScreens, defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  images: ["public/favicon.svg"],
  preset: combinePresetAndAppleSplashScreens(
    {
      ...minimal2023Preset,
      maskable: {
        ...minimal2023Preset.maskable,
        resizeOptions: {
          ...minimal2023Preset.maskable.resizeOptions,
          background: "#265456",
        },
      },
      apple: {
        ...minimal2023Preset.apple,
        resizeOptions: {
          ...minimal2023Preset.apple.resizeOptions,
          background: "#265456",
        },
      },
    },
    {
      resizeOptions: {},
    },
  ),
});
