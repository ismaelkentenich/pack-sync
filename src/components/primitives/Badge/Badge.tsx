import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import { getBadgeColors } from "./utils/getBadgeColors";
import type { BadgeProps } from "./types";

export function Badge({
  label,
  variant,
  style,
  textStyle,
  testID,
}: BadgeProps) {
  const colors = getBadgeColors(variant);

  return (
    <View
      testID={testID ?? "badgeRoot"}
      style={[
        styles.container,
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
