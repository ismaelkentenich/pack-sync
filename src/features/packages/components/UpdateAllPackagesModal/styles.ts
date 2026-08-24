import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  container: {
    flex: 1,
    gap: verticalScale(Theme.spacing.xl),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingTop: verticalScale(Theme.spacing.sm),
  },

  header: {
    gap: verticalScale(Theme.spacing.xs),
  },

  title: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxl,
    lineHeight: Theme.typography.lineHeight.xxl,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: -0.4,
  },

  description: {
    maxWidth: "90%",
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
  },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(Theme.spacing.sm),
    padding: verticalScale(Theme.spacing.md),
    borderWidth: 1,
    borderColor: Theme.colors.primary[100],
    borderRadius: moderateScale(Theme.radius.lg),
    backgroundColor: Theme.colors.primary[50],
  },

  summaryIconContainer: {
    width: horizontalScale(40),
    height: verticalScale(40),
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(Theme.radius.md),
    backgroundColor: Theme.colors.primary[100],
  },

  summaryContent: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xxxs,
  },

  summaryValue: {
    color: Theme.colors.primary[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },

  summaryDescription: {
    color: Theme.colors.primary[700],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
  },

  field: {
    gap: verticalScale(Theme.spacing.xs),
  },

  label: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
  },

  pickerWrapper: {
    height: verticalScale(120),
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: moderateScale(Theme.radius.lg),
    backgroundColor: Theme.colors.neutral[50],
  },

  picker: {
    width: "100%",
    color: Theme.colors.neutral[900],
    backgroundColor: Theme.colors.neutral[50],
  },

  pickerItem: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },

  actions: {
    marginTop: "auto",
    paddingTop: verticalScale(Theme.spacing.sm),
  },
});
