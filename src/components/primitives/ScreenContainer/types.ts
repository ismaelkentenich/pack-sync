import type { HeaderVariant } from "@components/composites/Header/types";
import type { StyleProp, ViewStyle } from "react-native";
import type { Edge } from "react-native-safe-area-context";

export type ScreenBackgroundVariant =
  "neutral50" | "neutral100";

export type ScreenContainerProps = {
  children: React.ReactNode;
  withHeader?: boolean;
  headerTitle?: string;
  showBackButton?: boolean;
  showLogout?: boolean;
  headerVariant?: HeaderVariant;
  scrollable?: boolean;
  showVerticalScroll?: boolean;
  withKeyboardAvoiding?: boolean;
  withStatusBar?: boolean;
  statusBarColor?: string;
  statusBarStyle?:
    "default" | "light-content" | "dark-content";
  withSafeArea?: boolean;
  safeAreaEdges?: Edge[];
  backgroundColorVariant?: ScreenBackgroundVariant;
  withGradientBackground?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};
