import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, LogOut } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import Theme from "@theme/theme";
import { styles } from "./styles";
import type { HeaderProps } from "./types";

export function Header({
  title,
  showBack = true,
  showLogout = false,
  testID,
}: HeaderProps) {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const logout = useAuthStore((state) => state.logout);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View
      testID={testID ?? "headerRoot"}
      style={styles.container}
    >
      {showBack ? (
        <TouchableOpacity
          testID="headerBackButton"
          accessibilityRole="button"
          accessibilityLabel={t(
            "accessibility.header.back",
          )}
          onPress={handleBack}
          style={styles.backButton}
        >
          <ArrowLeft
            testID="headerBackIcon"
            size={Theme.sizing.icon.md}
            color={Theme.colors.neutral[50]}
          />
        </TouchableOpacity>
      ) : null}

      <Text
        testID="headerTitle"
        style={styles.title}
        numberOfLines={1}
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
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <LogOut
            testID="headerLogoutIcon"
            size={Theme.sizing.icon.md}
            color={Theme.colors.neutral[50]}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
