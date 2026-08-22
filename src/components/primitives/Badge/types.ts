import type {
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export type BadgeVariant = "status" | "delivery";

export type BadgeColors = {
  backgroundColor: string;
  textColor: string;
};

export type BadgeProps = {
  label: string;
  variant: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};
