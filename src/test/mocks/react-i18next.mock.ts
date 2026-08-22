export const useTranslation = () => ({
  t: (key: string) => key,

  i18n: {
    language: "pt-BR",
    resolvedLanguage: "pt-BR",
    changeLanguage: jest.fn(),
  },
});

export const initReactI18next = {
  type: "3rdParty",
  init: jest.fn(),
};

export const Trans = ({
  children,
}: {
  children?: React.ReactNode;
}) => children ?? null;

export const I18nextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => children ?? null;
