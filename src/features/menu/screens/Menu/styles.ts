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
  },

  content: {
    flex: 1,
    paddingBottom: verticalScale(Theme.spacing.xxl),
    gap: Theme.spacing.xl,
  },

  header: {
    width: "100%",
  },

  title: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxl,
    lineHeight: Theme.typography.lineHeight.xxl,
    fontWeight: Theme.typography.weight.bold,
  },

  subtitle: {
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },

  section: {
    gap: verticalScale(Theme.spacing.sm),
  },

  sectionTitle: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
    textTransform: "uppercase",
  },

  menuCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.neutral[50],
  },

  separator: {
    height: 1,
    marginLeft: horizontalScale(76),
    backgroundColor: Theme.colors.neutral[200],
  },

  preferenceItem: {
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingVertical: verticalScale(Theme.spacing.md),
    gap: verticalScale(Theme.spacing.sm),
  },

  preferenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(Theme.spacing.md),
  },

  preferenceIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(Theme.radius.md),
    backgroundColor: Theme.colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },

  preferenceTextContainer: {
    flex: 1,
    minWidth: 0,
    gap: verticalScale(Theme.spacing.xxxs),
  },

  preferenceTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },

  preferenceDescription: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
  },

  segmentedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(Theme.spacing.xs),
    padding: moderateScale(4),
    borderRadius: moderateScale(Theme.radius.md),
    backgroundColor: Theme.colors.neutral[100],
  },

  segmentedButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: horizontalScale(Theme.spacing.xxs),
    minHeight: verticalScale(36),
    paddingHorizontal: horizontalScale(Theme.spacing.xs),
    borderRadius: moderateScale(Theme.radius.sm),
  },

  segmentedButtonActive: {
    backgroundColor: Theme.colors.neutral[0],
    shadowColor: Theme.colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },

  segmentedButtonText: {
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
    fontWeight: Theme.typography.weight.medium,
  },

  segmentedButtonTextActive: {
    color: Theme.colors.primary[600],
    fontWeight: Theme.typography.weight.semibold,
  },
});
