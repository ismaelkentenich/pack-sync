import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  heroCard: {
    position: "relative",
    minHeight: verticalScale(140),
    overflow: "hidden",
    padding: Theme.spacing.lg,
    justifyContent: "space-between",
    gap: Theme.spacing.xl,
    borderWidth: 0,
    backgroundColor: Theme.colors.secondary[400],
  },

  heroDecoration: {
    ...StyleSheet.absoluteFill,
  },

  heroDecorationCircleLarge: {
    position: "absolute",
    width: horizontalScale(180),
    height: verticalScale(180),
    borderRadius: horizontalScale(90),
    top: verticalScale(-70),
    right: horizontalScale(-55),
    backgroundColor: Theme.colors.secondary[200],
    opacity: 0.4,
  },

  heroDecorationCircleSmall: {
    position: "absolute",
    width: horizontalScale(90),
    height: verticalScale(90),
    borderRadius: horizontalScale(45),
    right: horizontalScale(Theme.spacing.md),
    bottom: verticalScale(-35),
    backgroundColor: Theme.colors.neutral[50],
    opacity: 0.18,
  },

  heroPackageIllustration: {
    position: "absolute",
    right: moderateScale(Theme.spacing.lg),
    top: "42%",
    opacity: 0.12,
    transform: [
      {
        rotate: "-8deg",
      },
      {
        scale: 2.4,
      },
    ],
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    zIndex: 1,
  },

  heroIconContainer: {
    width: horizontalScale(Theme.sizing.control.lg),
    height: verticalScale(Theme.sizing.control.lg),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(Theme.radius.md),
    backgroundColor: Theme.colors.primary[800],
  },

  heroContent: {
    maxWidth: "75%",
    gap: moderateScale(Theme.spacing.xs),
    zIndex: 1,
  },

  heroTitle: {
    color: Theme.colors.primary[800],
    fontSize: Theme.typography.size.xxl,
    lineHeight: Theme.typography.lineHeight.xxl,
    fontWeight: Theme.typography.weight.bold,
  },

  heroDescription: {
    color: Theme.colors.primary[800],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },

  heroAction: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(Theme.spacing.xs),
    paddingVertical: verticalScale(Theme.spacing.xs),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    borderRadius: moderateScale(Theme.radius.md),
    backgroundColor: Theme.colors.primary[600],
    zIndex: 1,
  },

  heroActionText: {
    color: Theme.colors.primary[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  secondaryCard: {
    minHeight: Theme.sizing.control.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.neutral[50],
  },

  secondaryIconContainer: {
    width: Theme.sizing.control.md,
    height: Theme.sizing.control.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary[100],
  },

  secondaryContent: {
    flex: 1,
    gap: Theme.spacing.xxs,
  },

  secondaryTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },

  secondaryDescription: {
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
  },

  secondaryArrowContainer: {
    width: Theme.sizing.control.sm,
    height: Theme.sizing.control.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary[100],
  },
});
