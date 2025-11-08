import { NavigationStack } from "@app/navigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setupAllDatabases } from "src/services/database/setup";

export default function App() {
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
          </NavigationContainer>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
