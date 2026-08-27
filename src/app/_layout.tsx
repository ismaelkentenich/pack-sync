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
import Theme from "@theme/theme";
import { ThemeProvider } from "@theme/ThemeProvider";

function RouterNavigation() {
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
          backgroundColor: Theme.colors.neutral[50],
        }}
      >
        <ActivityIndicator
          size="large"
          color={Theme.colors.primary[600]}
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
