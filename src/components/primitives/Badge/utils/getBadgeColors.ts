import Theme from "@theme/theme";
import type { BadgeColors, BadgeVariant } from "../types";

export function getBadgeColors(
  variant: BadgeVariant,
): BadgeColors {
  switch (variant) {
    case "delivery":
      return {
        backgroundColor: Theme.colors.secondary[200],
        textColor: Theme.colors.secondary[900],
      };

    case "status":
    default:
      return {
        backgroundColor: Theme.colors.primary[200],
        textColor: Theme.colors.primary[900],
      };
  }
}
