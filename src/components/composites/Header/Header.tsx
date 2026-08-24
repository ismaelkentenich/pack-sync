import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, LogOut } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import Theme from "@theme/theme";
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

  const navigation = useNavigation();

  const logout = useAuthStore((state) => state.logout);

  const isNeutral = variant === "neutral";

  const backgroundColor = isNeutral
    ? Theme.colors.neutral[100]
    : Theme.colors.primary[600];

  const foregroundColor = isNeutral
    ? Theme.colors.neutral[900]
    : Theme.colors.neutral[50];

  const actionColor = isNeutral
    ? Theme.colors.primary[600]
    : Theme.colors.neutral[50];

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
            onPress={() => navigation.goBack()}
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
