import Theme from "@theme/theme";
import type { HomeActionCardSize } from "../types";
import type { TextStyle, ViewStyle } from "react-native";

type HomeActionCardSizeStyles = {
  container: ViewStyle;
  iconContainer: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  iconSize: number;
  arrowSize: number;
};

const sizeStyles: Record<
  HomeActionCardSize,
  HomeActionCardSizeStyles
> = {
  sm: {
    container: {
      padding: Theme.spacing.sm,
      gap: Theme.spacing.sm,
    },

    iconContainer: {
      width: Theme.sizing.control.sm,
      height: Theme.sizing.control.sm,
    },

    title: {
      fontSize: Theme.typography.size.sm,
      lineHeight: Theme.typography.lineHeight.sm,
    },

    description: {
      fontSize: Theme.typography.size.xs,
      lineHeight: Theme.typography.lineHeight.xs,
    },

    iconSize: Theme.sizing.icon.sm,

    arrowSize: Theme.sizing.icon.xs,
  },

  md: {
    container: {
      padding: Theme.spacing.md,
      gap: Theme.spacing.md,
    },

    iconContainer: {
      width: Theme.sizing.control.md,
      height: Theme.sizing.control.md,
    },

    title: {
      fontSize: Theme.typography.size.md,
      lineHeight: Theme.typography.lineHeight.md,
    },

    description: {
      fontSize: Theme.typography.size.sm,
      lineHeight: Theme.typography.lineHeight.sm,
    },

    iconSize: Theme.sizing.icon.md,

    arrowSize: Theme.sizing.icon.sm,
  },

  lg: {
    container: {
      padding: Theme.spacing.lg,
      gap: Theme.spacing.lg,
    },

    iconContainer: {
      width: Theme.sizing.control.lg,
      height: Theme.sizing.control.lg,
    },

    title: {
      fontSize: Theme.typography.size.lg,
      lineHeight: Theme.typography.lineHeight.lg,
    },

    description: {
      fontSize: Theme.typography.size.md,
      lineHeight: Theme.typography.lineHeight.md,
    },

    iconSize: Theme.sizing.icon.lg,

    arrowSize: Theme.sizing.icon.sm,
  },
};

export function getHomeActionCardSizeStyles(
  size: HomeActionCardSize,
): HomeActionCardSizeStyles {
  return sizeStyles[size];
}
