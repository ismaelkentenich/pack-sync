import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Routes } from "../config/routes";
import { MainTabs } from "../tabs/MainTabs";
import type { RootStackParamList } from "../config/types";

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName={Routes.MainTabs}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.MainTabs}
        component={MainTabs}
      />
    </Stack.Navigator>
  );
}
