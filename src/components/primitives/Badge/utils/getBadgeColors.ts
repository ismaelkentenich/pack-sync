import Theme from "@theme/theme";
import type { BadgeColors, BadgeVariant } from "../types";

const badgeColors: Record<BadgeVariant, BadgeColors> = {
  primary: {
    backgroundColor: Theme.colors.primary[200],
    textColor: Theme.colors.primary[900],
  },

  secondary: {
    backgroundColor: Theme.colors.secondary[200],
    textColor: Theme.colors.secondary[900],
  },

  neutral: {
    backgroundColor: Theme.colors.neutral[200],
    textColor: Theme.colors.neutral[800],
  },

  success: {
    backgroundColor: Theme.colors.success[50],
    textColor: Theme.colors.success[700],
  },

  warning: {
    backgroundColor: Theme.colors.warning[50],
    textColor: Theme.colors.warning[700],
  },

  error: {
    backgroundColor: Theme.colors.error[50],
    textColor: Theme.colors.error[700],
  },
};

export function getBadgeColors(
  variant: BadgeVariant,
): BadgeColors {
  return badgeColors[variant];
}
