import Header from "@components/composites/Header";
import Theme from "@theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

type ScreenContainerProps = {
  children: React.ReactNode;
  withHeader?: boolean;
  headerTitle?: string;
  showBackButton?: boolean;
  scrollable?: boolean;
  showVerticalScroll?: boolean;
  withKeyboardAvoiding?: boolean;
  withStatusBar?: boolean;
  backgroundColorVariant?: "neutral50" | "neutral100";
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  statusBarColor?: string;
  showLogout?: boolean;
  withGradientBackground?: boolean;
};

export default function ScreenContainer({
  children,
  withHeader = true,
  headerTitle,
  showBackButton = true,
  scrollable = false,
  showVerticalScroll = false,
  withKeyboardAvoiding = false,
  backgroundColorVariant = "neutral50",
  style,
  contentContainerStyle,
  statusBarColor = Theme.colors.primary[600],
  showLogout,
  withGradientBackground = false,
}: ScreenContainerProps) {
  const backgroundColor =
    backgroundColorVariant === "neutral100" ? Theme.colors.neutral[100] : Theme.colors.neutral[50];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={statusBarColor} barStyle="dark-content" translucent={false} />

      <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled={withKeyboardAvoiding}
        >
          {withHeader && (
            <Header title={headerTitle} showBack={showBackButton} showLogout={showLogout} />
          )}
          {scrollable ? (
            <ScrollView
              contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
              showsVerticalScrollIndicator={showVerticalScroll}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          ) : (
            children
          )}
          {withGradientBackground && (
            <LinearGradient
              colors={[Theme.colors.primary[600], "transparent"]}
              style={[styles.background, { top: withHeader ? 56 : 0 }]}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
