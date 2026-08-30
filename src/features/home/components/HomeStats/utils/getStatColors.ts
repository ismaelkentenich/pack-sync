import { palette } from "@theme/foundations/colors";
import Theme from "@theme/theme";
import type { HomeStatVariant, StatColors } from "../types";
import type { AppTheme } from "@theme/types";

export function getStatColors(
  variant: HomeStatVariant,
  theme?: AppTheme,
): StatColors {
  const isDark =
    theme &&
    theme.colors.background.default !== palette.neutral[0];

  if (isDark) {
    switch (variant) {
      case "success":
        return {
          backgroundColor: palette.royalBlue[700],
          borderColor: palette.royalBlue[600],
          valueColor: palette.neutral[0],
          labelColor: palette.neutral[100],
        };

      case "warning":
        return {
          backgroundColor: palette.teal[700],
          borderColor: palette.teal[600],
          valueColor: palette.neutral[0],
          labelColor: palette.neutral[100],
        };

      case "neutral":
      default:
        return {
          backgroundColor: palette.neutral[900],
          borderColor: palette.neutral[700],
          valueColor: palette.neutral[0],
          labelColor: palette.neutral[100],
        };
    }
  }

  switch (variant) {
    case "success":
      return {
        backgroundColor: Theme.colors.primary[400],
        borderColor: Theme.colors.neutral[200],
        valueColor: Theme.colors.neutral[100],
        labelColor: Theme.colors.neutral[100],
      };

    case "warning":
      return {
        backgroundColor: Theme.colors.secondary[500],
        borderColor: Theme.colors.secondary[500],
        valueColor: Theme.colors.neutral[100],
        labelColor: Theme.colors.neutral[100],
      };

    case "neutral":
    default:
      return {
        backgroundColor: Theme.colors.primary[800],
        borderColor: Theme.colors.neutral[200],
        valueColor: Theme.colors.neutral[100],
        labelColor: Theme.colors.neutral[100],
      };
  }
}
