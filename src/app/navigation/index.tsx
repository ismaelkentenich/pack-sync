import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../features/login/screens/Login";

const Stack = createNativeStackNavigator();

export function NavigationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
