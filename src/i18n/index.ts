import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { enUS } from "./locales/en-US";
import { ptBR } from "./locales/pt-BR";

const deviceLocale = Localization.getLocales()[0];

const language =
  deviceLocale?.languageCode === "en" ? "en-US" : "pt-BR";

void i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": {
      translation: ptBR,
    },
    "en-US": {
      translation: enUS,
    },
  },

  lng: language,
  fallbackLng: "pt-BR",

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },
});

export default i18n;
