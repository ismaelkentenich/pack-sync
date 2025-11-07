import Card from "@components/Card";
import ScreenContainer from "@components/ScreenContainer";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Theme from "@theme/theme";
import { ScanQrCode } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { RootStackParamList } from "src/app/navigation/types";
import { useAuthStore } from "src/store/auth/useAuthStore";
import { styles } from "./styles";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { user } = useAuthStore();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.userInfoText}>Olá {user?.email}</Text>
        <Card style={styles.card} onPress={() => navigation.navigate("Scan")}>
          <ScanQrCode size={32} color={Theme.colors.neutral[700]} />
          <Text style={styles.cardText}>Scanner</Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
