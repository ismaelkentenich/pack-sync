import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@features/auth/screens/login";
import SignupScreen from "@features/auth/screens/signUp";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
    </Stack.Navigator>
  );
}
