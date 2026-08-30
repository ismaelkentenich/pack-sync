import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(Theme.spacing.xxxl),
  },

  listHeader: {
    gap: verticalScale(Theme.spacing.md),
    marginBottom: verticalScale(Theme.spacing.sm),
  },

  introduction: {
    gap: verticalScale(Theme.spacing.xs),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
  },

  headline: {
    maxWidth: horizontalScale(340),
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxl,
    lineHeight: Theme.typography.lineHeight.xxl,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: -0.5,
  },

  description: {
    maxWidth: horizontalScale(350),
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },

  syncBanner: {
    marginHorizontal: horizontalScale(Theme.spacing.md),
    padding: moderateScale(Theme.spacing.md),
    borderRadius: moderateScale(Theme.radius.xl),
    backgroundColor: Theme.colors.secondary[100],
    borderWidth: 1,
    borderColor: Theme.colors.secondary[300],
    gap: verticalScale(Theme.spacing.sm),
  },

  syncBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(Theme.spacing.sm),
  },

  syncBannerIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(Theme.radius.lg),
    backgroundColor: Theme.colors.secondary[200],
    alignItems: "center",
    justifyContent: "center",
  },

  syncBannerTextContainer: {
    flex: 1,
    minWidth: 0,
    gap: verticalScale(Theme.spacing.xxxs),
  },

  syncBannerTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.bold,
  },

  syncBannerDescription: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
  },

  controls: {
    gap: verticalScale(Theme.spacing.xl),
  },

  searchWrapper: {
    marginHorizontal: horizontalScale(Theme.spacing.md),
  },

  filtersSection: {
    gap: verticalScale(Theme.spacing.xs),
  },

  filtersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(Theme.spacing.md),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
  },

  filtersLabel: {
    flex: 1,
    color: Theme.colors.neutral[800],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  clearFiltersButton: {
    justifyContent: "center",
    paddingHorizontal: horizontalScale(Theme.spacing.xs),
  },

  clearFiltersText: {
    color: Theme.colors.primary[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  filtersContent: {
    gap: horizontalScale(Theme.spacing.xs),
    paddingRight: horizontalScale(Theme.spacing.xxl),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
  },

  filterChip: {
    minHeight: verticalScale(Theme.sizing.control.sm),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: moderateScale(Theme.radius.pill),
    backgroundColor: Theme.colors.neutral[50],
  },

  filterChipActive: {
    borderColor: Theme.colors.primary[600],
    backgroundColor: Theme.colors.primary[600],
  },

  filterChipText: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
  },

  filterChipTextActive: {
    color: Theme.colors.neutral[50],
    fontWeight: Theme.typography.weight.semibold,
  },

  resultsSummary: {
    gap: verticalScale(Theme.spacing.xxs),
    paddingTop: verticalScale(Theme.spacing.xs),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
  },

  resultsTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
  },

  resultsCount: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
  },

  cardWrapper: {
    marginBottom: verticalScale(Theme.spacing.sm),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "flex-start",
    gap: verticalScale(Theme.spacing.sm),
    paddingTop: verticalScale(Theme.spacing.xxxl),
    paddingHorizontal: horizontalScale(Theme.spacing.xl),
    paddingBottom: verticalScale(Theme.spacing.xxl),
  },

  emptyIconContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(Theme.spacing.xs),
    borderRadius: moderateScale(Theme.radius.xl),
    backgroundColor: Theme.colors.primary[100],
  },

  emptyTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
    textAlign: "center",
  },

  emptyDescription: {
    maxWidth: horizontalScale(290),

    color: Theme.colors.neutral[600],

    fontSize: Theme.typography.size.sm,

    lineHeight: Theme.typography.lineHeight.sm,

    textAlign: "center",
  },

  emptyClearButton: {
    minHeight: verticalScale(
      Theme.sizing.touchTarget.minimum,
    ),
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(Theme.spacing.xs),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    borderRadius: moderateScale(Theme.radius.md),
    backgroundColor: Theme.colors.primary[100],
  },

  emptyClearButtonText: {
    color: Theme.colors.primary[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },
});
