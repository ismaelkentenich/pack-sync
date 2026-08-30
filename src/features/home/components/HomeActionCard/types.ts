import type { LucideIcon } from "lucide-react-native";
import type {
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export type HomeActionCardVariant =
  | "hero"
  | "default"
  | "outlined"
  | "soft"
  | "accent"
  | "accentDark"
  | "danger";

export type HomeActionCardSize = "sm" | "md" | "lg";

export type HomeActionCardOrientation =
  "horizontal" | "vertical";

export type HomeActionCardProps = {
  testID?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  icon?: LucideIcon;
  variant?: HomeActionCardVariant;
  size?: HomeActionCardSize;
  orientation?: HomeActionCardOrientation;
  showArrow?: boolean;
  showDecoration?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  actionStyle?: StyleProp<ViewStyle>;
  actionTextStyle?: StyleProp<TextStyle>;
};
