import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import { getButtonColors } from "./utils/getButtonColors";
import { getButtonFontSize } from "./utils/getButtonFontSize";
import { getButtonHeight } from "./utils/getButtonHeight";
import { getButtonLineHeight } from "./utils/getButtonLineHeight";
import type { ButtonProps } from "./types";

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
  ...rest
}: ButtonProps) {
  const { theme } = useAppTheme();
  const height = getButtonHeight(size);
  const fontSize = getButtonFontSize(size);
  const lineHeight = getButtonLineHeight(size);

  const isDisabled = disabled || loading;

  const colors = getButtonColors(
    variant,
    theme,
    isDisabled,
  );

  return (
    <TouchableOpacity
      activeOpacity={0.72}
      disabled={isDisabled}
      testID={testID ?? "buttonTouchableOpacity"}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      style={[
        styles.button,
        {
          height,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={colors.textColor}
          testID="buttonActivityIndicator"
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize,
              lineHeight,
              color: colors.textColor,
            },
            textStyle,
          ]}
          testID="buttonText"
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
