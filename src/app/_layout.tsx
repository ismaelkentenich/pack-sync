import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalAlert } from "@components/composites/CustomAlert";
import { Button } from "@components/primitives/Button";
import { HeaderHeightProvider } from "@contexts/HeaderHeightContext";
import { usePersistedAuth } from "@features/auth/hooks/usePersistedAuth";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { useNetworkSync } from "@features/packages/hooks/useNetworkSync";
import { setupAllDatabases } from "@infrastructure/database/setup";
import { ThemeProvider } from "@theme/ThemeProvider";
import { useAppTheme } from "@theme/useAppTheme";

export type DatabaseBootstrapStatus =
  "loading" | "ready" | "error";

export function RouterNavigation() {
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
        testID="authRestoringIndicator"
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

export function DatabaseBootstrapState({
  status,
  errorMessage,
  onRetry,
}: {
  status: "loading" | "error";
  errorMessage?: string;
  onRetry: () => void;
}) {
  const { theme } = useAppTheme();

  if (status === "loading") {
    return (
      <View
        testID="databaseStartupLoading"
        style={[
          styles.centeredContainer,
          {
            backgroundColor:
              theme.colors.background.default,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.icon.brand}
        />
      </View>
    );
  }

  return (
    <View
      testID="databaseRecoveryError"
      style={[
        styles.centeredContainer,
        styles.errorContainer,
        {
          backgroundColor: theme.colors.background.default,
        },
      ]}
    >
      <Text
        style={[
          styles.errorTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Falha ao inicializar o banco de dados
      </Text>

      <Text
        style={[
          styles.errorMessage,
          { color: theme.colors.text.secondary },
        ]}
      >
        {errorMessage ||
          "Não foi possível preparar o armazenamento local. Tente novamente."}
      </Text>

      <Button
        title="Tentar novamente"
        variant="primary"
        size="lg"
        onPress={onRetry}
        testID="databaseRetryButton"
        style={styles.retryButton}
      />
    </View>
  );
}

export function AppContent() {
  const [status, setStatus] =
    useState<DatabaseBootstrapStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<
    string | undefined
  >();

  const executeBootstrap = useCallback(async () => {
    try {
      await setupAllDatabases();
      setStatus("ready");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao inicializar o banco de dados.";
      console.error("[Database] bootstrap:error", error);
      setErrorMessage(message);
      setStatus("error");
    }
  }, []);

  const handleRetry = useCallback(() => {
    setStatus("loading");
    setErrorMessage(undefined);
    executeBootstrap();
  }, [executeBootstrap]);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        await setupAllDatabases();
        if (isMounted) {
          setStatus("ready");
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao inicializar o banco de dados.";
          console.error(
            "[Database] bootstrap:error",
            error,
          );
          setErrorMessage(message);
          setStatus("error");
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status !== "ready") {
    return (
      <DatabaseBootstrapState
        status={status}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    );
  }

  return <RouterNavigation />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HeaderHeightProvider>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <AppContent />
              <GlobalAlert />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </HeaderHeightProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 8,
    minWidth: 200,
  },
});
