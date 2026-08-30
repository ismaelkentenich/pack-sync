import { palette } from "@theme/foundations/colors";
import Theme from "@theme/theme";
import type { HomeActionCardVariant } from "../types";
import type { AppTheme } from "@theme/types";

export type HomeActionCardColors = {
  backgroundColor: string;
  borderColor: string;
  titleColor: string;
  descriptionColor: string;
  iconBackgroundColor: string;
  iconColor: string;
  actionColor: string;
  arrowColor: string;
};

const lightColors: Record<
  HomeActionCardVariant,
  HomeActionCardColors
> = {
  hero: {
    backgroundColor: Theme.colors.secondary[400],
    borderColor: Theme.colors.secondary[400],
    titleColor: Theme.colors.neutral[900],
    descriptionColor: Theme.colors.neutral[700],
    iconBackgroundColor: Theme.colors.secondary[50],
    iconColor: Theme.colors.neutral[900],
    actionColor: Theme.colors.neutral[900],
    arrowColor: Theme.colors.neutral[900],
  },

  default: {
    backgroundColor: Theme.colors.neutral[50],
    borderColor: Theme.colors.neutral[200],
    titleColor: Theme.colors.neutral[900],
    descriptionColor: Theme.colors.neutral[600],
    iconBackgroundColor: Theme.colors.primary[100],
    iconColor: Theme.colors.primary[600],
    actionColor: Theme.colors.primary[600],
    arrowColor: Theme.colors.primary[600],
  },

  outlined: {
    backgroundColor: "transparent",
    borderColor: Theme.colors.primary[300],
    titleColor: Theme.colors.neutral[900],
    descriptionColor: Theme.colors.neutral[600],
    iconBackgroundColor: Theme.colors.primary[50],
    iconColor: Theme.colors.primary[600],
    actionColor: Theme.colors.primary[600],
    arrowColor: Theme.colors.primary[600],
  },

  soft: {
    backgroundColor: Theme.colors.primary[50],
    borderColor: Theme.colors.primary[100],
    titleColor: Theme.colors.primary[900],
    descriptionColor: Theme.colors.primary[700],
    iconBackgroundColor: Theme.colors.primary[100],
    iconColor: Theme.colors.primary[700],
    actionColor: Theme.colors.primary[700],
    arrowColor: Theme.colors.primary[700],
  },

  accent: {
    backgroundColor: Theme.colors.primary[600],
    borderColor: Theme.colors.primary[600],
    titleColor: Theme.colors.neutral[50],
    descriptionColor: Theme.colors.primary[100],
    iconBackgroundColor: Theme.colors.primary[700],
    iconColor: Theme.colors.neutral[50],
    actionColor: Theme.colors.neutral[50],
    arrowColor: Theme.colors.neutral[50],
  },

  accentDark: {
    backgroundColor: Theme.colors.primary[800],
    borderColor: Theme.colors.primary[800],
    titleColor: Theme.colors.neutral[50],
    descriptionColor: Theme.colors.primary[100],
    iconBackgroundColor: Theme.colors.primary[500],
    iconColor: Theme.colors.neutral[50],
    actionColor: Theme.colors.neutral[50],
    arrowColor: Theme.colors.neutral[50],
  },

  danger: {
    backgroundColor: Theme.colors.error[50],
    borderColor: Theme.colors.error[500],
    titleColor: Theme.colors.error[500],
    descriptionColor: Theme.colors.error[500],
    iconBackgroundColor: Theme.colors.error[500],
    iconColor: Theme.colors.error[50],
    actionColor: Theme.colors.error[500],
    arrowColor: Theme.colors.error[500],
  },
};

export function getHomeActionCardColors(
  variant: HomeActionCardVariant,
  theme?: AppTheme,
): HomeActionCardColors {
  if (
    !theme ||
    theme.colors.background.default === palette.neutral[0]
  ) {
    return lightColors[variant];
  }

  switch (variant) {
    case "hero":
      return {
        backgroundColor: palette.teal[600],
        borderColor: palette.teal[500],
        titleColor: palette.neutral[0],
        descriptionColor: palette.neutral[100],
        iconBackgroundColor: palette.teal[800],
        iconColor: palette.neutral[0],
        actionColor: palette.neutral[0],
        arrowColor: palette.neutral[0],
      };

    case "default":
      return {
        backgroundColor: theme.colors.surface.default,
        borderColor: theme.colors.border.default,
        titleColor: theme.colors.text.primary,
        descriptionColor: theme.colors.text.secondary,
        iconBackgroundColor: theme.colors.surface.subtle,
        iconColor: theme.colors.icon.brand,
        actionColor: theme.colors.text.brand,
        arrowColor: theme.colors.icon.brand,
      };

    case "outlined":
      return {
        backgroundColor: "transparent",
        borderColor: theme.colors.border.brand,
        titleColor: theme.colors.text.primary,
        descriptionColor: theme.colors.text.secondary,
        iconBackgroundColor: theme.colors.surface.subtle,
        iconColor: theme.colors.icon.brand,
        actionColor: theme.colors.text.brand,
        arrowColor: theme.colors.icon.brand,
      };

    case "soft":
      return {
        backgroundColor: theme.colors.surface.subtle,
        borderColor: theme.colors.border.subtle,
        titleColor: theme.colors.text.primary,
        descriptionColor: theme.colors.text.secondary,
        iconBackgroundColor: theme.colors.surface.muted,
        iconColor: theme.colors.text.brand,
        actionColor: theme.colors.text.brand,
        arrowColor: theme.colors.text.brand,
      };

    case "accent":
      return {
        backgroundColor: palette.royalBlue[600],
        borderColor: palette.royalBlue[500],
        titleColor: palette.neutral[0],
        descriptionColor: palette.neutral[100],
        iconBackgroundColor: palette.royalBlue[700],
        iconColor: palette.neutral[0],
        actionColor: palette.neutral[0],
        arrowColor: palette.neutral[0],
      };

    case "accentDark":
      return {
        backgroundColor: palette.neutral[900],
        borderColor: palette.royalBlue[700],
        titleColor: palette.neutral[0],
        descriptionColor: palette.neutral[200],
        iconBackgroundColor: palette.royalBlue[800],
        iconColor: palette.neutral[0],
        actionColor: palette.neutral[0],
        arrowColor: palette.neutral[0],
      };

    case "danger":
      return {
        backgroundColor:
          theme.colors.status.error.background,
        borderColor: theme.colors.border.error,
        titleColor: theme.colors.text.error,
        descriptionColor: theme.colors.text.error,
        iconBackgroundColor:
          theme.colors.status.error.background,
        iconColor: theme.colors.text.error,
        actionColor: theme.colors.text.error,
        arrowColor: theme.colors.text.error,
      };
  }
}
