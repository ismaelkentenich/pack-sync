import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@app/navigation/types";

export const useAppNavigation = <
  T extends keyof RootStackParamList,
>(
  _screenName: T,
) =>
  useNavigation<
    NativeStackNavigationProp<RootStackParamList, T>
  >();
