import { flatten, resolveTemplate, translator } from "@solid-primitives/i18n";
import en from "../../assets/locales/en.json" with { type: "json" };

const dict = {
  en: flatten(en),
} as const;

export const useLocale = () => () => "en" as const;

const resolveDict = () => {
  return dict[useLocale()()];
};

export const useI18n = () => {
  return translator(resolveDict, resolveTemplate);
};
