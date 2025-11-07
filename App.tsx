import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { NavigationStack } from "@app/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setupAuthDatabase } from "src/services/database/auth/setup";
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
    <SafeAreaProvider>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
