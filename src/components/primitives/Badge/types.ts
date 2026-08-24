import type {
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "neutral"
  | "success"
  | "warning"
  | "error";

export type BadgeSize = "sm" | "md" | "lg";

export type BadgeColors = {
  backgroundColor: string;
  textColor: string;
};

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};
