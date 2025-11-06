import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { NavigationStack } from "./src/app/navigation";

export default function App() {
  return (
    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>
  );
}
