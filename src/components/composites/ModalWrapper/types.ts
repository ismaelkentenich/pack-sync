import type { ReactNode } from "react";
import type {
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ModalWrapperProps = {
  children: ReactNode;
  isBlocked?: boolean;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  snapPoints?: (string | number)[];
  isModalFixed?: boolean;
  hasInputInsideModal?: boolean;
  testID?: string;
};

export type ModalCloseIconProps = TouchableOpacityProps & {
  onPress: () => void;
  testID?: string;
};
