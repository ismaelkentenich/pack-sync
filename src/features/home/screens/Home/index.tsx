import { ScanQrCode, Scroll } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Routes } from "@app/navigation/routes";
import Card from "@components/primitives/Card";
import ScreenContainer from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { useAppNavigation } from "@hooks/useAppNavigation";
import Theme from "@theme/legacy/legacyTheme";
import { styles } from "./styles";

export default function HomeScreen() {
  const { t } = useTranslation();

  const user = useAuthStore((state) => state.user);
  const navigation = useAppNavigation(Routes.Home);

  return (
    <ScreenContainer
      withHeader
      headerTitle={t("navigation.home")}
      showBackButton={false}
      showLogout
      withGradientBackground
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {t("home.greeting")}
          </Text>

          <Text style={styles.userInfoText}>
            {user?.email}
          </Text>
        </View>

        <Card
          style={styles.card}
          onPress={() => navigation.navigate("Scan")}
        >
          <ScanQrCode
            size={32}
            color={Theme.colors.neutral[700]}
          />

          <Text style={styles.cardText}>
            {t("home.scanner")}
          </Text>
        </Card>

        <Card
          style={styles.card}
          onPress={() =>
            navigation.navigate("PackagesList")
          }
        >
          <Scroll
            size={32}
            color={Theme.colors.neutral[700]}
          />

          <Text style={styles.cardText}>
            {t("home.packageList")}
          </Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
