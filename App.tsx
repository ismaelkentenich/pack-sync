import { NavigationStack } from "@app/navigation";
import GlobalAlert from "@components/composites/CustomAlert";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useNetworkSync } from "@features/packages/hooks/useNetworkSync";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setupAllDatabases } from "@infrastructure/database/setup";
import { useAuthStore } from "@features/auth/store/useAuthStore";

export default function App() {
  const userId = useAuthStore((state) => state.user?.id);

  useNetworkSync(userId);

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
        <BottomSheetModalProvider>
          <NavigationContainer>
            <NavigationStack />
            <GlobalAlert />
          </NavigationContainer>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
