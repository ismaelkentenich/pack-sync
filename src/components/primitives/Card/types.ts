import type React from "react";
import type {
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type CardProps = TouchableOpacityProps & {
  children: React.ReactNode;
  touchable?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};
