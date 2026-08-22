import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@features/home/screens/Home";
import PackageDetailsScreen from "@features/packages/screens/PackageDetails";
import PackagesListScreen from "@features/packages/screens/PackagesList";
import ScanScreen from "@features/scanner/screens/Scanner";

const Stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen
        name="PackagesList"
        component={PackagesListScreen}
      />
      <Stack.Screen
        name="PackageDetails"
        component={PackageDetailsScreen}
      />
    </Stack.Navigator>
  );
}
