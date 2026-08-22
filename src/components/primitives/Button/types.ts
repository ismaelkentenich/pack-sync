import type {
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ButtonVariant =
  | "primary"
  | "brand"
  | "accent"
  | "secondary"
  | "outline"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonColors = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

export type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};
