import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@features/home/screens";
import PackagesListScreen from "@features/packages/screens/packagesList";
import PackageDetailsScreen from "@features/packages/screens/packageDetails";
import ScanScreen from "@features/scanner/screens";

const Stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="PackagesList" component={PackagesListScreen} />
      <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
    </Stack.Navigator>
  );
}
