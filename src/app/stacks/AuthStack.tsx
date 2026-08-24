import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@features/auth/screens/Login";
import SignupScreen from "@features/auth/screens/SignUp";
import { Routes } from "../config/routes";
import type { AuthStackParamList } from "../config/types";

const Stack =
  createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Login}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.Login}
        component={LoginScreen}
      />

      <Stack.Screen
        name={Routes.SignUp}
        component={SignupScreen}
      />
    </Stack.Navigator>
  );
}
