import { usePersistedAuth } from "@features/auth/hooks/usePersistedAuth";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import Theme from "@theme/theme";
import { ActivityIndicator, View } from "react-native";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";

export function NavigationStack() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

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
