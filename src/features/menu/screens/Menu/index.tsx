import * as Haptics from "expo-haptics";
import {
  Languages,
  LogOut,
  Moon,
  PackageSearch,
  Palette,
  ScanLine,
  Smartphone,
  Sun,
} from "lucide-react-native";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { Routes } from "@config/routes";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { MenuItem } from "@features/menu/components/MenuItem";
import { useMainTabNavigation } from "@hooks/useMainTabNavigation";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { type ThemePreference } from "@theme/ThemeProvider";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";

export default function MenuScreen() {
  const { t, i18n } = useTranslation();

  const navigation = useMainTabNavigation();

  const logout = useAuthStore((state) => state.logout);

  const { preference, setPreference } = useAppTheme();

  const currentLanguage =
    i18n.resolvedLanguage ?? i18n.language ?? "pt-BR";

  const handleOpenScanner = useCallback(() => {
    navigation.navigate(Routes.Scan);
  }, [navigation]);

  const handleOpenPackages = useCallback(() => {
    navigation.navigate(Routes.Packages);
  }, [navigation]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleSelectTheme = useCallback(
    (newPref: ThemePreference) => {
      if (newPref === preference) {
        return;
      }

      void Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );
      setPreference(newPref);
    },
    [preference, setPreference],
  );

  const handleSelectLanguage = useCallback(
    (lang: string) => {
      if (lang === currentLanguage) {
        return;
      }

      void Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );
      void i18n.changeLanguage(lang);
    },
    [currentLanguage, i18n],
  );

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
            {t("menu.sections.preferences")}
          </Text>

          <View style={styles.menuCard}>
            <View
              testID="menuThemePreference"
              style={styles.preferenceItem}
            >
              <View style={styles.preferenceHeader}>
                <View
                  style={styles.preferenceIconContainer}
                >
                  <Palette
                    size={moderateScale(20)}
                    color={Theme.colors.primary[600]}
                  />
                </View>

                <View
                  style={styles.preferenceTextContainer}
                >
                  <Text style={styles.preferenceTitle}>
                    {t("menu.items.theme.title")}
                  </Text>
                  <Text
                    style={styles.preferenceDescription}
                  >
                    {t("menu.items.theme.description")}
                  </Text>
                </View>
              </View>

              <View
                testID="menuThemeSegmented"
                style={styles.segmentedContainer}
                accessibilityRole="radiogroup"
              >
                <TouchableOpacity
                  testID="menuThemeSystemButton"
                  accessibilityRole="radio"
                  accessibilityLabel={t(
                    "accessibility.menu.themeSystem",
                  )}
                  accessibilityState={{
                    selected: preference === "system",
                  }}
                  style={[
                    styles.segmentedButton,
                    preference === "system" &&
                      styles.segmentedButtonActive,
                  ]}
                  onPress={() =>
                    handleSelectTheme("system")
                  }
                  activeOpacity={0.7}
                >
                  <Smartphone
                    size={moderateScale(14)}
                    color={
                      preference === "system"
                        ? Theme.colors.primary[600]
                        : Theme.colors.neutral[500]
                    }
                  />
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      preference === "system" &&
                        styles.segmentedButtonTextActive,
                    ]}
                  >
                    {t("menu.items.theme.system")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="menuThemeLightButton"
                  accessibilityRole="radio"
                  accessibilityLabel={t(
                    "accessibility.menu.themeLight",
                  )}
                  accessibilityState={{
                    selected: preference === "light",
                  }}
                  style={[
                    styles.segmentedButton,
                    preference === "light" &&
                      styles.segmentedButtonActive,
                  ]}
                  onPress={() => handleSelectTheme("light")}
                  activeOpacity={0.7}
                >
                  <Sun
                    size={moderateScale(14)}
                    color={
                      preference === "light"
                        ? Theme.colors.primary[600]
                        : Theme.colors.neutral[500]
                    }
                  />
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      preference === "light" &&
                        styles.segmentedButtonTextActive,
                    ]}
                  >
                    {t("menu.items.theme.light")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="menuThemeDarkButton"
                  accessibilityRole="radio"
                  accessibilityLabel={t(
                    "accessibility.menu.themeDark",
                  )}
                  accessibilityState={{
                    selected: preference === "dark",
                  }}
                  style={[
                    styles.segmentedButton,
                    preference === "dark" &&
                      styles.segmentedButtonActive,
                  ]}
                  onPress={() => handleSelectTheme("dark")}
                  activeOpacity={0.7}
                >
                  <Moon
                    size={moderateScale(14)}
                    color={
                      preference === "dark"
                        ? Theme.colors.primary[600]
                        : Theme.colors.neutral[500]
                    }
                  />
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      preference === "dark" &&
                        styles.segmentedButtonTextActive,
                    ]}
                  >
                    {t("menu.items.theme.dark")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.separator} />

            <View
              testID="menuLanguagePreference"
              style={styles.preferenceItem}
            >
              <View style={styles.preferenceHeader}>
                <View
                  style={styles.preferenceIconContainer}
                >
                  <Languages
                    size={moderateScale(20)}
                    color={Theme.colors.primary[600]}
                  />
                </View>

                <View
                  style={styles.preferenceTextContainer}
                >
                  <Text style={styles.preferenceTitle}>
                    {t("menu.items.language.title")}
                  </Text>
                  <Text
                    style={styles.preferenceDescription}
                  >
                    {t("menu.items.language.description")}
                  </Text>
                </View>
              </View>

              <View
                testID="menuLanguageSegmented"
                style={styles.segmentedContainer}
                accessibilityRole="radiogroup"
              >
                <TouchableOpacity
                  testID="menuLanguagePtButton"
                  accessibilityRole="radio"
                  accessibilityLabel={t(
                    "accessibility.menu.languagePtBR",
                  )}
                  accessibilityState={{
                    selected:
                      currentLanguage.startsWith("pt"),
                  }}
                  style={[
                    styles.segmentedButton,
                    currentLanguage.startsWith("pt") &&
                      styles.segmentedButtonActive,
                  ]}
                  onPress={() =>
                    handleSelectLanguage("pt-BR")
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      currentLanguage.startsWith("pt") &&
                        styles.segmentedButtonTextActive,
                    ]}
                  >
                    {t("menu.items.language.ptBR")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="menuLanguageEnButton"
                  accessibilityRole="radio"
                  accessibilityLabel={t(
                    "accessibility.menu.languageEnUS",
                  )}
                  accessibilityState={{
                    selected:
                      currentLanguage.startsWith("en"),
                  }}
                  style={[
                    styles.segmentedButton,
                    currentLanguage.startsWith("en") &&
                      styles.segmentedButtonActive,
                  ]}
                  onPress={() =>
                    handleSelectLanguage("en-US")
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      currentLanguage.startsWith("en") &&
                        styles.segmentedButtonTextActive,
                    ]}
                  >
                    {t("menu.items.language.enUS")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
