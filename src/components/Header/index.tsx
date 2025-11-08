import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, LogOut } from "lucide-react-native";
import Theme from "@theme/theme";
import { styles } from "./styles";
import { useAuthStore } from "@store/auth/useAuthStore";

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
};

export default function Header({ title, showBack = true, showLogout = false }: HeaderProps) {
  const navigation = useNavigation();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" as never }],
    });
  }

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={Theme.colors.neutral[50]} />
        </TouchableOpacity>
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {showLogout ? (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={22} color={Theme.colors.neutral[50]} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
