import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  House,
  PackageSearch,
  ScanLine,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import HomeScreen from "@features/home/screens/Home";
import ScanScreen from "@features/scanner/screens/Scanner";
import { verticalScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { Routes } from "../config/routes";
import { PackagesStack } from "../stacks/PackagesStack";
import type { MainTabParamList } from "../config/types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName={Routes.Home}
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
          shadowOffset: {
            width: 0,
            height: -2,
          },
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
      <Tab.Screen
        name={Routes.Home}
        component={HomeScreen}
        options={{
          tabBarLabel: t("navigation.home"),

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

      <Tab.Screen
        name={Routes.Scan}
        component={ScanScreen}
        options={{
          tabBarLabel: t("navigation.scan"),

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

      <Tab.Screen
        name={Routes.Packages}
        component={PackagesStack}
        options={{
          tabBarLabel: t("navigation.packages"),

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
    </Tab.Navigator>
  );
}
