import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import { getBadgeColors } from "./utils/getBadgeColors";
import { getBadgeSizeStyles } from "./utils/getBadgeSizeStyles";
import type { BadgeProps } from "./types";

export function Badge({
  label,
  variant = "neutral",
  size = "md",
  style,
  textStyle,
  testID,
}: BadgeProps) {
  const colors = getBadgeColors(variant);
  const sizeStyles = getBadgeSizeStyles(size);

  return (
    <View
      testID={testID ?? "badgeRoot"}
      style={[
        styles.container,
        sizeStyles.container,
        {
          backgroundColor: colors.backgroundColor,
        },
        style,
      ]}
    >
      <Text
        testID="badgeText"
        style={[
          styles.text,
          sizeStyles.text,
          {
            color: colors.textColor,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
