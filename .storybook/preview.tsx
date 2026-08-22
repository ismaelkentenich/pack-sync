import "@i18n/index";

import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { Preview } from "@storybook/react-native-web-vite";

const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <NavigationContainer>
          <View
            style={{
              flex: 1,
            }}
          >
            <Story />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    ),
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },
};

export default preview;
