import { lightTheme } from "@theme/appTheme";
import type { InputState } from "../types";
import type { AppTheme } from "@theme/types";

export type InputColors = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  placeholderColor: string;
  labelColor: string;
  iconColor: string;
  supportingTextColor: string;
};

export function getInputColors(
  state: InputState,
  theme: AppTheme = lightTheme,
): InputColors {
  const { colors } = theme;
  switch (state) {
    case "focused":
      return {
        backgroundColor: colors.surface.default,
        borderColor: colors.border.brand,
        textColor: colors.text.primary,
        placeholderColor: colors.text.disabled,
        labelColor: colors.text.brand,
        iconColor: colors.icon.brand,
        supportingTextColor: colors.text.secondary,
      };

    case "error":
      return {
        backgroundColor: colors.surface.default,
        borderColor: colors.border.error,
        textColor: colors.text.primary,
        placeholderColor: colors.text.disabled,
        labelColor: colors.text.error,
        iconColor: colors.text.error,
        supportingTextColor: colors.text.error,
      };

    case "disabled":
      return {
        backgroundColor: colors.surface.subtle,
        borderColor: colors.border.subtle,
        textColor: colors.text.disabled,
        placeholderColor: colors.text.disabled,
        labelColor: colors.text.disabled,
        iconColor: colors.icon.disabled,
        supportingTextColor: colors.text.disabled,
      };

    case "default":
    default:
      return {
        backgroundColor: colors.surface.default,
        borderColor: colors.border.default,
        textColor: colors.text.primary,
        placeholderColor: colors.text.disabled,
        labelColor: colors.text.secondary,
        iconColor: colors.icon.secondary,
        supportingTextColor: colors.text.secondary,
      };
  }
}
