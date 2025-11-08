import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@features/login/screens/Login";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
