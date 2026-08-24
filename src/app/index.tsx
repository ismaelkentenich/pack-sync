import { ActivityIndicator, View } from "react-native";
import { usePersistedAuth } from "@features/auth/hooks/usePersistedAuth";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { useNetworkSync } from "@features/packages/hooks/useNetworkSync";
import Theme from "@theme/theme";
import { AppStack } from "./stacks/AppStack";
import { AuthStack } from "./stacks/AuthStack";

export function NavigationStack() {
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
