import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

export type InputState =
  "default" | "focused" | "error" | "disabled";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  secure?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  testID?: string;
};
