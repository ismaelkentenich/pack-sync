import React from "react";
import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";
import { Button } from "@components/primitives/Button";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import { useDatabaseBootstrap } from "../../hooks/useDatabaseBootstrap";

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

export function AppBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, errorMessage, handleRetry } =
    useDatabaseBootstrap();

  if (status !== "ready") {
    return (
      <DatabaseBootstrapState
        status={status}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    );
  }

  return <>{children}</>;
}
