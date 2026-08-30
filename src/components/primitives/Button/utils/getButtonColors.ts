import { lightTheme } from "@theme/appTheme";
import type { ButtonColors, ButtonVariant } from "../types";
import type { AppTheme } from "@theme/types";

export function getButtonColors(
  variant: ButtonVariant,
  themeOrDisabled: AppTheme | boolean = lightTheme,
  disabled = false,
): ButtonColors {
  const theme =
    typeof themeOrDisabled === "boolean"
      ? lightTheme
      : themeOrDisabled;
  const isDisabled =
    typeof themeOrDisabled === "boolean"
      ? themeOrDisabled
      : disabled;
  const { colors } = theme;

  if (isDisabled) {
    return {
      backgroundColor: colors.action.disabled.background,
      borderColor: colors.action.disabled.background,
      textColor: colors.action.disabled.foreground,
    };
  }

  switch (variant) {
    case "brand":
      return {
        backgroundColor: colors.action.brand.background,
        borderColor: colors.action.brand.background,
        textColor: colors.action.brand.foreground,
      };

    case "accent":
      return {
        backgroundColor: colors.action.accent.background,
        borderColor: colors.action.accent.background,
        textColor: colors.action.accent.foreground,
      };

    case "secondary":
      return {
        backgroundColor: colors.action.secondary.background,
        borderColor: colors.action.secondary.background,
        textColor: colors.action.secondary.foreground,
      };

    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: colors.border.strong,
        textColor: colors.text.primary,
      };

    case "danger":
      return {
        backgroundColor: colors.action.danger.background,
        borderColor: colors.action.danger.background,
        textColor: colors.action.danger.foreground,
      };

    case "primary":
    default:
      return {
        backgroundColor: colors.action.primary.background,
        borderColor: colors.action.primary.background,
        textColor: colors.action.primary.foreground,
      };
  }
}
