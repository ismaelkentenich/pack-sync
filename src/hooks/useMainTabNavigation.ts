import { useNavigation } from "@react-navigation/native";
import type { MainTabParamList } from "@app/config/types";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export function useMainTabNavigation<
  T extends keyof MainTabParamList,
>() {
  return useNavigation<
    BottomTabNavigationProp<MainTabParamList, T>
  >();
}
