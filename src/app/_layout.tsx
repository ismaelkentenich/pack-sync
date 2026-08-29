import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalAlert } from "@components/composites/CustomAlert";
import { HeaderHeightProvider } from "@contexts/HeaderHeightContext";
import {
  selectIsAuthenticated,
  useAuthStore,
} from "@features/auth/store/useAuthStore";
import { ThemeProvider } from "@theme/ThemeProvider";
import { useAppTheme } from "@theme/useAppTheme";
import { AppBootstrap } from "./bootstrap/AppBootstrap";
import { useAppLifecycle } from "../hooks/useAppLifecycle";

export function RouterNavigation() {
  const { theme } = useAppTheme();
  const isAuthenticated = useAuthStore(
    selectIsAuthenticated,
  );
  const { isRestoring } = useAppLifecycle();

  if (isRestoring) {
    return (
      <View
        testID="authRestoringIndicator"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background.default,
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.icon.brand}
        />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export function AppContent() {
  return (
    <AppBootstrap>
      <RouterNavigation />
    </AppBootstrap>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HeaderHeightProvider>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <AppContent />
              <GlobalAlert />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </HeaderHeightProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
