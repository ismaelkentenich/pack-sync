import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PackageDetailsScreen from "@features/packages/screens/PackageDetails";
import PackagesListScreen from "@features/packages/screens/PackagesList";
import { Routes } from "../config/routes";
import type { PackagesStackParamList } from "../config/types";

const Stack =
  createNativeStackNavigator<PackagesStackParamList>();

export function PackagesStack() {
  return (
    <Stack.Navigator
      initialRouteName={Routes.PackagesList}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.PackagesList}
        component={PackagesListScreen}
      />

      <Stack.Screen
        name={Routes.PackageDetails}
        component={PackageDetailsScreen}
      />
    </Stack.Navigator>
  );
}
