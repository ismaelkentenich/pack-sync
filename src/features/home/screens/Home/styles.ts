import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingTop: verticalScale(Theme.spacing.md),
    paddingBottom: verticalScale(Theme.spacing.xxxl),
    gap: verticalScale(Theme.spacing.md),
  },

  introduction: {
    paddingRight: horizontalScale(Theme.spacing.md),
    borderRadius: moderateScale(Theme.radius.md),
    paddingTop: verticalScale(Theme.spacing.lg),
  },

  headline: {
    color: Theme.colors.primary[800],
    fontSize: Theme.typography.size.xxxxxl,
    lineHeight: Theme.typography.lineHeight.xxxxl,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: -0.8,
  },

  description: {
    color: Theme.colors.primary[600],
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

  circleLargeSecondary: {
    position: "absolute",
    width: horizontalScale(300),
    height: verticalScale(300),
    borderRadius: moderateScale(Theme.radius.pill),
    top: verticalScale(600),
    right: horizontalScale(-20),
    backgroundColor: Theme.colors.secondary[200],
    opacity: 0.5,
  },

  circleLargePrimary: {
    position: "absolute",
    width: horizontalScale(400),
    height: verticalScale(400),
    borderRadius: moderateScale(Theme.radius.pill),
    top: verticalScale(100),
    right: horizontalScale(250),
    backgroundColor: Theme.colors.primary[600],
    opacity: 0.3,
  },

  circleSmallPrimary: {
    position: "absolute",
    width: horizontalScale(100),
    height: verticalScale(100),
    borderRadius: moderateScale(Theme.radius.pill),
    top: verticalScale(350),
    right: horizontalScale(-20),
    backgroundColor: Theme.colors.primary[600],
    opacity: 0.3,
  },

  circleSmallSecondary: {
    position: "absolute",
    width: horizontalScale(160),
    height: verticalScale(160),
    borderRadius: moderateScale(Theme.radius.pill),
    top: verticalScale(80),
    right: horizontalScale(-40),
    backgroundColor: Theme.colors.secondary[200],
    opacity: 0.5,
  },
});
