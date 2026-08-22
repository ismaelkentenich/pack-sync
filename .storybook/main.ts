import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],

  framework: {
    name: "@storybook/react-native-web-vite",
    options: {},
  },

  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "@env": fileURLToPath(
            new URL("./env.ts", import.meta.url),
          ),

          "@features/auth/store/useAuthStore":
            fileURLToPath(
              new URL(
                "./mocks/useAuthStore.ts",
                import.meta.url,
              ),
            ),
        },
      },
    });
  },
};

export default config;
