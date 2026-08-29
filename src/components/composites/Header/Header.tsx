import { useRouter } from "expo-router";
import { ArrowLeft, LogOut } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthOperations } from "@features/auth/hooks/useAuthOperations";
import Theme from "@theme/theme";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import type { HeaderProps } from "./types";

export function Header({
  title,
  showBack = true,
  showLogout = false,
  variant = "brand",
  testID,
  onLayout,
  style,
}: HeaderProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const router = useRouter();

  const { logout } = useAuthOperations();

  const isNeutral = variant === "neutral";

  const backgroundColor = isNeutral
    ? theme.colors.background.subtle
    : theme.colors.background.brand;

  const foregroundColor = isNeutral
    ? theme.colors.text.primary
    : theme.colors.text.inverse;

  const actionColor = isNeutral
    ? theme.colors.icon.brand
    : theme.colors.icon.inverse;

  return (
    <SafeAreaView
      testID={testID ?? "headerRoot"}
      edges={["top"]}
      onLayout={onLayout}
      style={[
        styles.safeArea,
        {
          backgroundColor,
        },
        style,
      ]}
    >
      <View
        testID="headerContent"
        style={[
          styles.container,
          {
            backgroundColor,
          },
        ]}
      >
        {showBack ? (
          <TouchableOpacity
            testID="headerBackButton"
            accessibilityRole="button"
            accessibilityLabel={t(
              "accessibility.header.back",
            )}
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft
              testID="headerBackIcon"
              size={Theme.sizing.icon.md}
              color={actionColor}
            />
          </TouchableOpacity>
        ) : null}

        <Text
          testID="headerTitle"
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: foregroundColor,
            },
          ]}
        >
          {title}
        </Text>

        {showLogout ? (
          <TouchableOpacity
            testID="headerLogoutButton"
            accessibilityRole="button"
            accessibilityLabel={t(
              "accessibility.header.logout",
            )}
            activeOpacity={0.7}
            onPress={logout}
            style={styles.logoutButton}
          >
            <LogOut
              testID="headerLogoutIcon"
              size={Theme.sizing.icon.md}
              color={actionColor}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
