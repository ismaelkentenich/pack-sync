import "@i18n/index";

import React from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HeaderHeightProvider } from "../src/contexts/HeaderHeightContext";
import type { Preview } from "@storybook/react-native";

const preview: Preview = {
  decorators: [
    (Story) => (
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <SafeAreaProvider>
          <HeaderHeightProvider>
            <View
              style={{
                flex: 1,
              }}
            >
              <Story />
            </View>
          </HeaderHeightProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    ),
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,

        date: /Date$/i,
      },
    },
  },
};

export default preview;
