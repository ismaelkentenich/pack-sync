import Theme from "@theme/theme";
import { HomeStatVariant, StatColors } from "../types";

export function getStatColors(
  variant: HomeStatVariant,
): StatColors {
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
