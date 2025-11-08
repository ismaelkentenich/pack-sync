import React from "react";
import { KeyboardAvoidingView, ScrollView, Platform, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "@theme/theme";
import { styles } from "./styles";
import Header from "@components/Header";

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
  style?: any;
  contentContainerStyle?: any;
  statusBarColor?: string;
  showLogout?: boolean;
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
}: ScreenContainerProps) {
  const backgroundColor =
    backgroundColorVariant === "neutral100" ? Theme.colors.neutral[100] : Theme.colors.neutral[50];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={statusBarColor} barStyle="dark-content" translucent={false} />

      <SafeAreaView style={[styles.container, { backgroundColor: statusBarColor }, style]}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled={withKeyboardAvoiding}
        >
          {withHeader && <Header title={headerTitle} showBack={showBackButton} showLogout={showLogout} />}
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
