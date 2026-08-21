import LoginScreen from "@features/auth/screens/Login";
import SignupScreen from "@features/auth/screens/SignUp";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
      />
    </Stack.Navigator>
  );
}
