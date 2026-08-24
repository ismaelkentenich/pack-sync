import { useNavigation } from "@react-navigation/native";
import type { AuthStackParamList } from "@app/config/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export function useAuthNavigation<
  T extends keyof AuthStackParamList,
>() {
  return useNavigation<
    NativeStackNavigationProp<AuthStackParamList, T>
  >();
}
