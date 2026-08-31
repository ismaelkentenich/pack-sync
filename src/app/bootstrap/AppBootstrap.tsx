import React from "react";
import { useTranslation } from "react-i18next";
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
  onRetry,
}: {
  status: "loading" | "error";
  onRetry: () => void;
}) {
  const { t } = useTranslation();
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
        {t("bootstrap.database.title")}
      </Text>

      <Text
        style={[
          styles.errorMessage,
          { color: theme.colors.text.secondary },
        ]}
      >
        {t("bootstrap.database.defaultError")}
      </Text>

      <Button
        title={t("bootstrap.database.retry")}
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
  const { status, handleRetry } = useDatabaseBootstrap();

  if (status !== "ready") {
    return (
      <DatabaseBootstrapState
        status={status}
        onRetry={handleRetry}
      />
    );
  }

  return <>{children}</>;
}
