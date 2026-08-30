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
    paddingBottom: verticalScale(32),
  },

  container: {
    width: "100%",
    maxWidth: horizontalScale(640),
    alignSelf: "center",
    gap: verticalScale(Theme.spacing.xl),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingTop: verticalScale(Theme.spacing.xs),
  },

  introduction: {
    gap: verticalScale(Theme.spacing.xs),
  },

  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(Theme.spacing.sm),
  },

  iconContainer: {
    width: horizontalScale(48),
    height: horizontalScale(48),
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary[100],
  },

  codeContent: {
    flex: 1,
    gap: verticalScale(2),
  },

  code: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxl,
    lineHeight: Theme.typography.lineHeight.xxl,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: moderateScale(-0.4),
  },

  description: {
    maxWidth: horizontalScale(420),
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
  },

  statusCard: {
    gap: 0,
    padding: 0,
    overflow: "hidden",
    backgroundColor: Theme.colors.neutral[50],
  },

  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: horizontalScale(Theme.spacing.sm),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingVertical: verticalScale(Theme.spacing.sm),
  },

  statusLabel: {
    flexShrink: 1,
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
  },

  statusDivider: {
    height: 1,
    marginHorizontal: horizontalScale(Theme.spacing.md),
    backgroundColor: Theme.colors.neutral[200],
  },

  section: {
    gap: verticalScale(Theme.spacing.md),
  },

  sectionTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },

  informationCard: {
    gap: 0,
    padding: 0,
    overflow: "hidden",
    backgroundColor: Theme.colors.neutral[50],
  },

  informationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(Theme.spacing.md),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingVertical: verticalScale(Theme.spacing.sm),
  },

  informationIconContainer: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary[100],
  },

  informationContent: {
    flex: 1,
    minWidth: 0,
    gap: verticalScale(Theme.spacing.xxxs),
  },

  informationLabel: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
    fontWeight: Theme.typography.weight.medium,
  },

  informationValue: {
    flexShrink: 1,
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.medium,
  },

  informationValueMuted: {
    color: Theme.colors.neutral[500],
    fontWeight: Theme.typography.weight.regular,
  },

  informationDivider: {
    height: 1,
    marginHorizontal: horizontalScale(16),
    backgroundColor: Theme.colors.neutral[200],
  },
});
