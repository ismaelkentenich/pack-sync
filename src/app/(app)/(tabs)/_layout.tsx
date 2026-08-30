import { Tabs } from "expo-router";
import {
  House,
  Menu,
  PackageSearch,
  ScanLine,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Platform, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { useAppTheme } from "@theme/useAppTheme";

const TAB_BAR_CONTENT_HEIGHT = 56;

export default function MainTabsLayout() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const insets = useSafeAreaInsets();

  const bottomInset = insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.icon.brand,
        tabBarInactiveTintColor:
          theme.colors.icon.secondary,
        tabBarActiveBackgroundColor: "transparent",
        tabBarInactiveBackgroundColor: "transparent",
        tabBarButton: ({ ref: _ref, ...props }) => (
          <Pressable
            {...props}
            android_ripple={{
              color: "transparent",
            }}
          />
        ),
        tabBarStyle: {
          height: moderateScale(
            TAB_BAR_CONTENT_HEIGHT + bottomInset,
          ),
          paddingTop: moderateScale(Theme.spacing.xs),
          paddingBottom: moderateScale(bottomInset),
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.subtle,
          backgroundColor: theme.colors.surface.default,
          shadowColor: theme.colors.background.inverse,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: Platform.OS === "android" ? 8 : 0,
        },
        tabBarItemStyle: {
          height: moderateScale(TAB_BAR_CONTENT_HEIGHT),
        },
        tabBarLabelStyle: {
          fontSize: Theme.typography.size.xs,
          lineHeight: Theme.typography.lineHeight.xs,
          fontWeight: Theme.typography.weight.medium,
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
