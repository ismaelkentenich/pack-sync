import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import type { CardProps } from "./types";

export function Card({
  children,
  touchable = true,
  style,
  testID,
  disabled = false,
  ...rest
}: CardProps) {
  if (!touchable) {
    return (
      <View
        testID={testID ?? "cardRoot"}
        style={[styles.cardContainer, style]}
      >
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      testID={testID ?? "cardRoot"}
      accessibilityRole="button"
      accessibilityState={{
        disabled,
      }}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.cardContainer, style]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}
