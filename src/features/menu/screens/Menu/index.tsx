import {
  LogOut,
  PackageSearch,
  ScanLine,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { Routes } from "@config/routes";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { MenuItem } from "@features/menu/components/MenuItem";
import { useMainTabNavigation } from "@hooks/useMainTabNavigation";
import { styles } from "./styles";

export default function MenuScreen() {
  const { t } = useTranslation();

  const navigation = useMainTabNavigation();

  const logout = useAuthStore((state) => state.logout);

  const handleOpenScanner = () => {
    navigation.navigate(Routes.Scan);
  };

  const handleOpenPackages = () => {
    navigation.navigate(Routes.Packages);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ScreenContainer
      testID="menuScreen"
      headerTitle={t("menu.title")}
      withHeader
      headerVariant="neutral"
      showBackButton={false}
      scrollable
      backgroundColorVariant="neutral100"
      contentContainerStyle={styles.screenContent}
    >
      <View testID="menuScreen" style={styles.content}>
        <View style={styles.header}>
          <Text
            testID="menuSubtitle"
            style={styles.subtitle}
          >
            {t("menu.subtitle")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("menu.sections.operations")}
          </Text>

          <View style={styles.menuCard}>
            <MenuItem
              testID="menuScanItem"
              title={t("menu.items.scan.title")}
              description={t("menu.items.scan.description")}
              accessibilityLabel={t(
                "accessibility.menu.scan",
              )}
              icon={ScanLine}
              onPress={handleOpenScanner}
            />

            <View style={styles.separator} />

            <MenuItem
              testID="menuPackagesItem"
              title={t("menu.items.packages.title")}
              description={t(
                "menu.items.packages.description",
              )}
              accessibilityLabel={t(
                "accessibility.menu.packages",
              )}
              icon={PackageSearch}
              onPress={handleOpenPackages}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("menu.sections.account")}
          </Text>

          <View style={styles.menuCard}>
            <MenuItem
              testID="menuLogoutItem"
              title={t("menu.items.logout.title")}
              description={t(
                "menu.items.logout.description",
              )}
              accessibilityLabel={t(
                "accessibility.menu.logout",
              )}
              icon={LogOut}
              onPress={handleLogout}
              destructive
              showChevron={false}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
