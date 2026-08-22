module.exports = {
  preset: "jest-expo",

  clearMocks: true,

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@env$": "<rootDir>/src/test/mocks/env.mock.ts",

    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@theme/(.*)$": "<rootDir>/src/theme/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@infrastructure/(.*)$":
      "<rootDir>/src/infrastructure/$1",
    "^@i18n/(.*)$": "<rootDir>/src/i18n/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@test$": "<rootDir>/src/test/index.ts",
    "^@test/(.*)$": "<rootDir>/src/test/$1",
  },

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/i18n/locales/**",
  ],

  coverageDirectory: "coverage",
};
