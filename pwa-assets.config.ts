import { combinePresetAndAppleSplashScreens, defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  images: ["public/favicon.svg"],
  preset: combinePresetAndAppleSplashScreens(
    minimal2023Preset,
    {
      resizeOptions: {
        background: "#fdf2f8",
      },
    },
  ),
});
