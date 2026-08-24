import type {
  LayoutChangeEvent,
  ViewStyle,
} from "react-native";

export type HeaderVariant = "brand" | "neutral";

export type HeaderProps = {
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
  variant?: HeaderVariant;
  testID?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  style?: ViewStyle;
};
