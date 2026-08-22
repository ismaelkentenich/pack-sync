import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  heroCard: {
    minHeight: 250,
    padding: Theme.spacing.lg,
    justifyContent: "space-between",
    gap: Theme.spacing.xl,
    borderWidth: 0,
    backgroundColor: Theme.colors.secondary[400],
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  heroIconContainer: {
    width: Theme.sizing.control.lg,
    height: Theme.sizing.control.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.neutral[50],
  },

  heroContent: {
    gap: Theme.spacing.xs,
  },

  heroTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxl,
    lineHeight: Theme.typography.lineHeight.xxl,
    fontWeight: Theme.typography.weight.bold,
  },

  heroDescription: {
    maxWidth: 280,
    color: Theme.colors.neutral[800],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },

  heroAction: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.neutral[50],
  },

  heroActionText: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  secondaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
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
});
