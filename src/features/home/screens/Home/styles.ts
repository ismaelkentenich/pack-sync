import { StyleSheet } from "react-native";
import {
  horizontalScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingTop: verticalScale(Theme.spacing.md),
    paddingBottom: verticalScale(Theme.spacing.xxxl),
    gap: verticalScale(Theme.spacing.xl),
  },

  introduction: {
    gap: verticalScale(Theme.spacing.xs),
  },

  headline: {
    maxWidth: horizontalScale(330),
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxxl,
    lineHeight: Theme.typography.lineHeight.xxxl,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: -0.8,
  },

  description: {
    maxWidth: horizontalScale(340),
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },

  primaryAction: {
    marginTop: verticalScale(Theme.spacing.xxs),
  },

  section: {
    gap: verticalScale(Theme.spacing.sm),
  },

  sectionTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
  },
});
