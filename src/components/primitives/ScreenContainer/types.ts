import type { ReactNode } from "react";
import type {
  StatusBarStyle,
  StyleProp,
  ViewStyle,
} from "react-native";

export type ScreenBackgroundVariant =
  "neutral50" | "neutral100";

export type ScreenContainerProps = {
  children: ReactNode;

  withHeader?: boolean;
  headerTitle?: string;
  showBackButton?: boolean;
  showLogout?: boolean;

  scrollable?: boolean;
  showVerticalScroll?: boolean;

  withKeyboardAvoiding?: boolean;

  withStatusBar?: boolean;
  statusBarColor?: string;
  statusBarStyle?: StatusBarStyle;

  backgroundColorVariant?: ScreenBackgroundVariant;

  withGradientBackground?: boolean;

  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;

  testID?: string;
};
