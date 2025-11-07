import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { NavigationStack } from "@app/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
