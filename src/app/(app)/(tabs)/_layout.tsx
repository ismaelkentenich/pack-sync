import { Tabs } from "expo-router";
import {
  House,
  Menu,
  PackageSearch,
  ScanLine,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { verticalScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";

export default function MainTabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Theme.colors.primary[600],
        tabBarInactiveTintColor: Theme.colors.neutral[500],
        tabBarStyle: {
          height: verticalScale(100),
          paddingTop: verticalScale(Theme.spacing.xs),
          paddingBottom: verticalScale(Theme.spacing.xxxl),
          borderTopWidth: 1,
          borderTopColor: Theme.colors.neutral[200],
          backgroundColor: Theme.colors.neutral[50],
          shadowColor: Theme.colors.neutral[950],
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: Theme.typography.size.xs,
          lineHeight: Theme.typography.lineHeight.xs,
          fontWeight: Theme.typography.weight.medium,
        },
        tabBarItemStyle: {
          paddingVertical: verticalScale(Theme.spacing.xxs),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("navigation.home"),
          tabBarAccessibilityLabel: t(
            "accessibility.navigation.home",
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <House
              size={size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: t("navigation.scan"),
          tabBarAccessibilityLabel: t(
            "accessibility.navigation.scan",
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <ScanLine
              size={size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          title: t("navigation.packages"),
          tabBarAccessibilityLabel: t(
            "accessibility.navigation.packages",
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <PackageSearch
              size={size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t("navigation.menu"),
          tabBarAccessibilityLabel: t(
            "accessibility.navigation.menu",
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <Menu
              size={size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
