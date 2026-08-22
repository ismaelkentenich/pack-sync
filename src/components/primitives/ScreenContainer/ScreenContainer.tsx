import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@components/composites/Header";
import Theme from "@theme/theme";
import { styles } from "./styles";
import type {
  ScreenBackgroundVariant,
  ScreenContainerProps,
} from "./types";

function getBackgroundColor(
  variant: ScreenBackgroundVariant,
): string {
  switch (variant) {
    case "neutral100":
      return Theme.colors.neutral[100];

    case "neutral50":
    default:
      return Theme.colors.neutral[50];
  }
}

export function ScreenContainer({
  children,
  withHeader = true,
  headerTitle,
  showBackButton = true,
  showLogout = false,
  scrollable = false,
  showVerticalScroll = false,
  withKeyboardAvoiding = false,
  withStatusBar = true,
  statusBarColor = Theme.colors.primary[600],
  statusBarStyle = "dark-content",
  backgroundColorVariant = "neutral50",
  withGradientBackground = false,
  style,
  contentContainerStyle,
  testID,
}: ScreenContainerProps) {
  const backgroundColor = getBackgroundColor(
    backgroundColorVariant,
  );

  const gradientTop = withHeader
    ? Theme.sizing.control.lg
    : 0;

  const content = scrollable ? (
    <ScrollView
      testID="screenContainerScrollView"
      contentContainerStyle={[
        styles.scrollContent,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={showVerticalScroll}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      testID="screenContainerContent"
      style={[styles.content, contentContainerStyle]}
    >
      {children}
    </View>
  );

  return (
    <View
      testID={testID ?? "screenContainerRoot"}
      style={styles.root}
    >
      {withStatusBar ? (
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle={statusBarStyle}
          translucent={false}
        />
      ) : null}

      <SafeAreaView
        testID="screenContainerSafeArea"
        style={[
          styles.container,
          {
            backgroundColor,
          },
          style,
        ]}
      >
        <KeyboardAvoidingView
          testID="screenContainerKeyboardAvoiding"
          style={styles.keyboardAvoiding}
          behavior={
            Platform.OS === "ios" ? "padding" : "height"
          }
          enabled={withKeyboardAvoiding}
        >
          {withHeader ? (
            <Header
              title={headerTitle}
              showBack={showBackButton}
              showLogout={showLogout}
            />
          ) : null}

          {content}

          {withGradientBackground ? (
            <LinearGradient
              testID="screenContainerGradient"
              pointerEvents="none"
              colors={[
                Theme.colors.primary[600],
                "transparent",
              ]}
              style={[
                styles.background,
                {
                  top: gradientTop,
                },
              ]}
            />
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
