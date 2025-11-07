import React from "react";
import { ViewStyle, StatusBar, StatusBarStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "@theme/theme";

type ScreenContainerProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
  style?: ViewStyle;
};

export default function ScreenContainer({
  children,
  backgroundColor = Theme.colors.neutral[50],
  barStyle = "dark-content",
  style,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  );
}
