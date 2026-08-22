import "@i18n/index";

import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { Preview } from "@storybook/react-native-web-vite";

function StorybookContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width, height } = useWindowDimensions();

  return (
    <GestureHandlerRootView
      style={{
        width,
        height,
      }}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          <View
            style={{
              width,
              height,
            }}
          >
            {children}
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <StorybookContainer>
        <Story />
      </StorybookContainer>
    ),
  ],

  parameters: {
    layout: "fullscreen",

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
