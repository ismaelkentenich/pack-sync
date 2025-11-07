import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../features/login/screens/Login";
import HomeScreen from "../../features/home/screens";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function NavigationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
