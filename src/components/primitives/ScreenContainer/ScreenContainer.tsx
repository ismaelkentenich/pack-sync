import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Header } from "@components/composites/Header";
import { useHeaderHeight } from "@contexts/HeaderHeightContext";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import type {
  ScreenBackgroundVariant,
  ScreenContainerProps,
} from "./types";

function getBackgroundColor(
  variant: ScreenBackgroundVariant,
  theme: ReturnType<typeof useAppTheme>["theme"],
): string {
  switch (variant) {
    case "neutral100":
      return theme.colors.background.subtle;

    case "primary600":
      return theme.colors.background.brand;

    case "neutral50":
    default:
      return theme.colors.background.default;
  }
}

export function ScreenContainer({
  children,
  withHeader = true,
  headerTitle,
  showBackButton = true,
  showLogout = false,
  headerVariant = "brand",
  scrollable = false,
  showVerticalScroll = false,
  withKeyboardAvoiding = false,
  withStatusBar = true,
  statusBarColor,
  statusBarStyle = "dark-content",
  withSafeArea = false,
  safeAreaEdges = ["bottom"],
  backgroundColorVariant = "neutral50",
  withGradientBackground = false,
  style,
  contentContainerStyle,
  testID,
}: ScreenContainerProps) {
  const { theme, resolvedTheme } = useAppTheme();
  const { setHeaderHeight } = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [localHeaderHeight, setLocalHeaderHeight] =
    useState(0);

  const backgroundColor = getBackgroundColor(
    backgroundColorVariant,
    theme,
  );

  const headerBackgroundColor =
    headerVariant === "neutral"
      ? backgroundColor
      : theme.colors.background.brand;

  const resolvedStatusBarColor =
    statusBarColor ?? headerBackgroundColor;

  const resolvedStatusBarStyle =
    resolvedTheme === "dark"
      ? "light-content"
      : statusBarStyle;

  const handleHeaderLayout = useCallback(
    (
      event: Parameters<
        NonNullable<
          React.ComponentProps<typeof Header>["onLayout"]
        >
      >[0],
    ) => {
      const { height } = event.nativeEvent.layout;

      if (height === localHeaderHeight) {
        return;
      }

      setLocalHeaderHeight(height);

      setHeaderHeight(height);
    },
    [localHeaderHeight, setHeaderHeight],
  );

  const content = scrollable ? (
    <ScrollView
      testID="screenContainerScrollView"
      contentContainerStyle={[
        styles.scrollContent,
        contentContainerStyle,
        {
          paddingBottom: insets.bottom,
          paddingTop: withHeader ? 0 : insets.top,
        },
      ]}
      showsVerticalScrollIndicator={showVerticalScroll}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={
        Platform.OS === "ios" ? "interactive" : "on-drag"
      }
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

  const mainContent = (
    <KeyboardAvoidingView
      testID="screenContainerKeyboardAvoiding"
      style={styles.keyboardAvoiding}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
      keyboardVerticalOffset={
        withHeader ? localHeaderHeight : 0
      }
      enabled={withKeyboardAvoiding}
    >
      {content}

      {withGradientBackground ? (
        <LinearGradient
          testID="screenContainerGradient"
          pointerEvents="none"
          colors={[
            theme.colors.background.brand,
            "transparent",
          ]}
          style={styles.background}
        />
      ) : null}
    </KeyboardAvoidingView>
  );

  return (
    <View
      testID={testID ?? "screenContainerRoot"}
      style={[
        styles.root,
        {
          backgroundColor,
        },
      ]}
    >
      {withStatusBar ? (
        <StatusBar
          backgroundColor={resolvedStatusBarColor}
          barStyle={resolvedStatusBarStyle}
          translucent={false}
        />
      ) : null}

      {withHeader ? (
        <Header
          title={headerTitle}
          showBack={showBackButton}
          showLogout={showLogout}
          variant={headerVariant}
          onLayout={handleHeaderLayout}
        />
      ) : null}

      {withSafeArea ? (
        <SafeAreaView
          testID="screenContainerSafeArea"
          edges={safeAreaEdges}
          style={[
            styles.safeArea,
            {
              backgroundColor,
            },
            style,
          ]}
        >
          {mainContent}
        </SafeAreaView>
      ) : (
        <View
          testID="screenContainerUnsafeArea"
          style={[
            styles.safeArea,
            {
              backgroundColor,
            },
            style,
          ]}
        >
          {mainContent}
        </View>
      )}
    </View>
  );
}
