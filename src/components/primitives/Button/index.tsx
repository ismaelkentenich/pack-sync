import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import Theme from "@theme/theme";
import { styles } from "./styles";

type ButtonVariant =
  "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const { colors, typography, radius, sizing } = Theme;

  const backgroundColor =
    variant === "primary"
      ? colors.primary[600]
      : variant === "secondary"
        ? colors.secondary[600]
        : variant === "danger"
          ? colors.error[500]
          : "transparent";

  const textColor =
    variant === "outline"
      ? colors.primary[600]
      : colors.neutral[50];

  const borderColor =
    variant === "outline"
      ? colors.primary[600]
      : "transparent";

  const height =
    size === "sm"
      ? sizing.control.sm
      : size === "lg"
        ? sizing.control.lg
        : sizing.control.md;

  const fontSize =
    size === "sm"
      ? typography.size.sm
      : size === "lg"
        ? typography.size.lg
        : typography.size.md;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: disabled
            ? colors.neutral[300]
            : backgroundColor,
          borderColor,
          borderRadius: radius.md,
          height,
          opacity: loading ? 0.8 : 1,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
