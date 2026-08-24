import type { LucideIcon } from "lucide-react-native";
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

export type InputState =
  "default" | "focused" | "error" | "disabled";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  secure?: boolean;
  size?: InputSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
};
