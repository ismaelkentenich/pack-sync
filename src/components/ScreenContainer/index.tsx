import React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StatusBarStyle,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "@theme/theme";
import { styles } from "./styles";

type ScreenContainerProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export default function ScreenContainer({
  children,
  backgroundColor = Theme.colors.neutral[50],
  barStyle = "dark-content",
  scrollable = false,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.container}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
