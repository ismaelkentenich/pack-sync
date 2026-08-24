import Theme from "@theme/theme";
import type { HomeActionCardVariant } from "../types";

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

const colors: Record<
  HomeActionCardVariant,
  HomeActionCardColors
> = {
  hero: {
    backgroundColor: Theme.colors.secondary[400],
    borderColor: Theme.colors.secondary[200],
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
): HomeActionCardColors {
  return colors[variant];
}
