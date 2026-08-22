import type { StyleProp, ViewStyle } from "react-native";

export type CustomAlertProps = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText: string;
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
};
