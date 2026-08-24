import { useNavigation } from "@react-navigation/native";
import type { PackagesStackParamList } from "@app/config/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export function usePackagesNavigation<
  T extends keyof PackagesStackParamList,
>() {
  return useNavigation<
    NativeStackNavigationProp<PackagesStackParamList, T>
  >();
}
