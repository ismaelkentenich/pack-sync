import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalAlert } from "@components/composites/CustomAlert";
import { HeaderHeightProvider } from "@contexts/HeaderHeightContext";
import { usePersistedAuth } from "@features/auth/hooks/usePersistedAuth";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { useNetworkSync } from "@features/packages/hooks/useNetworkSync";
import { setupAllDatabases } from "@infrastructure/database/setup";
import { ThemeProvider } from "@theme/ThemeProvider";
import { useAppTheme } from "@theme/useAppTheme";

function RouterNavigation() {
  const { theme } = useAppTheme();
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const userId = useAuthStore((state) => state.user?.id);
  const { isRestoring } = usePersistedAuth();

  useNetworkSync(isRestoring ? undefined : userId);

  if (isRestoring) {
    return (
      <View
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

export default function RootLayout() {
  useEffect(() => {
    async function prepareDatabases() {
      try {
        await setupAllDatabases();
      } catch (error) {
        console.error("Erro ao inicializar bancos:", error);
      }
    }

    prepareDatabases();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HeaderHeightProvider>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <RouterNavigation />
              <GlobalAlert />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </HeaderHeightProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
