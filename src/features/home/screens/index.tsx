import { Routes } from "@app/navigation/routes";
import Card from "@components/Card";
import ScreenContainer from "@components/ScreenContainer";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { useAuthStore } from "@store/auth/useAuthStore";
import Theme from "@theme/theme";
import { ScanQrCode, Scroll } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const navigation = useAppNavigation(Routes.Home);

  return (
    <ScreenContainer withHeader headerTitle="Início" showBackButton={false} showLogout={true}>
      <View style={styles.container}>
        <Text style={styles.userInfoText}>Olá {user?.email}</Text>
        <Card style={styles.card} onPress={() => navigation.navigate("Scan")}>
          <ScanQrCode size={32} color={Theme.colors.neutral[700]} />
          <Text style={styles.cardText}>Scanner</Text>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate("PackagesList")}>
          <Scroll size={32} color={Theme.colors.neutral[700]} />
          <Text style={styles.cardText}>Lista de Pacotes</Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
