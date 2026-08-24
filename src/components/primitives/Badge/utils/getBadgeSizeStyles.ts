import Theme from "@theme/theme";
import type { BadgeSize } from "../types";
import type { TextStyle, ViewStyle } from "react-native";

type BadgeSizeStyles = {
  container: ViewStyle;
  text: TextStyle;
};

const badgeSizeStyles: Record<BadgeSize, BadgeSizeStyles> =
  {
    sm: {
      container: {
        paddingHorizontal: Theme.spacing.xs,
        paddingVertical: Theme.spacing.xxs,
        borderRadius: Theme.radius.xs,
      },
      text: {
        fontSize: Theme.typography.size.xs,
        lineHeight: Theme.typography.lineHeight.xs,
      },
    },

    md: {
      container: {
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: Theme.spacing.xxs,
        borderRadius: Theme.radius.sm,
      },
      text: {
        fontSize: Theme.typography.size.sm,
        lineHeight: Theme.typography.lineHeight.sm,
      },
    },

    lg: {
      container: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.xs,
        borderRadius: Theme.radius.md,
      },
      text: {
        fontSize: Theme.typography.size.md,
        lineHeight: Theme.typography.lineHeight.md,
      },
    },
  };

export function getBadgeSizeStyles(
  size: BadgeSize,
): BadgeSizeStyles {
  return badgeSizeStyles[size];
}
