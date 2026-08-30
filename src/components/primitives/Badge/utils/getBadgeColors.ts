import { lightTheme } from "@theme/appTheme";
import type { BadgeColors, BadgeVariant } from "../types";
import type { AppTheme } from "@theme/types";

export function getBadgeColors(
  variant: BadgeVariant,
  theme: AppTheme = lightTheme,
): BadgeColors {
  const { colors } = theme;

  const badgeColors: Record<BadgeVariant, BadgeColors> = {
    primary: {
      backgroundColor: colors.surface.brandSubtle,
      textColor: colors.text.brand,
    },

    secondary: {
      backgroundColor: colors.surface.accentSubtle,
      textColor: colors.text.primary,
    },

    neutral: {
      backgroundColor: colors.surface.muted,
      textColor: colors.text.primary,
    },

    success: {
      backgroundColor: colors.status.success.background,
      textColor: colors.status.success.foreground,
    },

    warning: {
      backgroundColor: colors.status.warning.background,
      textColor: colors.status.warning.foreground,
    },

    error: {
      backgroundColor: colors.status.error.background,
      textColor: colors.status.error.foreground,
    },
  };

  return badgeColors[variant];
}
