import React from "react";
import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { usePersistedAuth } from "@features/auth/hooks/usePersistedAuth";
import { View, ActivityIndicator } from "react-native";
import Theme from "@theme/theme";

export function NavigationStack() {
  const { isAuthenticated } = useAuthStore();
  const { isRestoring } = usePersistedAuth();

  if (isRestoring) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Theme.colors.neutral[50],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={Theme.colors.primary[600]}
        />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
