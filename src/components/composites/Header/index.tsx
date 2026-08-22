import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, LogOut } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import Theme from "@theme/theme";
import { styles } from "./styles";

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
};

export default function Header({
  title,
  showBack = true,
  showLogout = false,
}: HeaderProps) {
  const navigation = useNavigation();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
  }

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft
            size={Theme.sizing.icon.md}
            color={Theme.colors.neutral[50]}
          />
        </TouchableOpacity>
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {showLogout ? (
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <LogOut
            size={Theme.sizing.icon.md}
            color={Theme.colors.neutral[50]}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
