import ScreenContainer from "@components/ScreenContainer";
import React from "react";
import { Text, View } from "react-native";
import { useAuthStore } from "src/store/auth/useAuthStore";
import { styles } from "./styles";

export default function HomeScreen() {
  const { user } = useAuthStore();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>HOME</Text>
        <Text style={styles.userInfoText}>Olá {user?.email}</Text>
      </View>
    </ScreenContainer>
  );
}
