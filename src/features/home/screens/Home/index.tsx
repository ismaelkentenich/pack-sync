import {
  PackageSearch,
  ScanQrCode,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Routes } from "@app/config/routes";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { HomeActionCard } from "@features/home/components/HomeActionCard";
import { HomeHeader } from "@features/home/components/HomeHeader";
import { HomeStats } from "@features/home/components/HomeStats";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { useMainTabNavigation } from "@hooks/useMainTabNavigation";
import { styles } from "./styles";

export default function HomeScreen() {
  const { t } = useTranslation();

  const navigation =
    useMainTabNavigation<typeof Routes.Home>();

  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);

  const packagesCount = usePackageStore(
    (state) => state.packages.length,
  );

  const pendingCount = usePackageStore(
    (state) => state.pendingCount,
  );

  const userEmail = user?.email ?? undefined;

  const handleLogout = async () => {
    await logout();
  };

  const handleOpenScanner = () => {
    navigation.navigate(Routes.Scan);
  };

  const handleOpenPackages = () => {
    navigation.navigate(Routes.Packages);
  };

  return (
    <ScreenContainer
      testID="homeScreen"
      withHeader={false}
      scrollable
      backgroundColorVariant="neutral100"
      contentContainerStyle={styles.screenContent}
      safeAreaEdges={["top"]}
    >
      <HomeHeader
        greeting={t("home.greeting")}
        email={userEmail}
        logoutAccessibilityLabel={t(
          "accessibility.header.logout",
        )}
        onLogout={handleLogout}
      />

      <View
        testID="homeIntroduction"
        style={styles.introduction}
      >
        <Text
          testID="homeHeadline"
          style={styles.headline}
          accessibilityRole="header"
        >
          {t("home.headline")}
        </Text>

        <Text
          testID="homeDescription"
          style={styles.description}
        >
          {t("home.description")}
        </Text>
      </View>

      <View
        testID="homePrimaryAction"
        style={styles.primaryAction}
      >
        <HomeActionCard
          testID="homeScannerCard"
          icon={ScanQrCode}
          variant="hero"
          title={t("home.scanner.title")}
          description={t("home.scanner.description")}
          actionLabel={t("home.scanner.action")}
          onPress={handleOpenScanner}
        />
      </View>

      <View testID="homeOverview" style={styles.section}>
        <Text
          testID="homeOverviewTitle"
          style={styles.sectionTitle}
        >
          {t("home.overview")}
        </Text>

        <HomeStats
          items={[
            {
              label: t("home.stats.packages"),
              value: packagesCount,
              variant: "neutral",
            },
            {
              label: t("home.stats.pending"),
              value: pendingCount,
              variant:
                pendingCount > 0 ? "warning" : "success",
            },
          ]}
        />
      </View>

      <View
        testID="homeQuickActions"
        style={styles.section}
      >
        <Text
          testID="homeQuickActionsTitle"
          style={styles.sectionTitle}
        >
          {t("home.quickActions")}
        </Text>

        <HomeActionCard
          testID="homePackagesCard"
          icon={PackageSearch}
          title={t("home.packageList.title")}
          description={t("home.packageList.description")}
          onPress={handleOpenPackages}
        />
      </View>
    </ScreenContainer>
  );
}
