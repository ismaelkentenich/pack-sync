import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxxl,
    gap: Theme.spacing.lg,
  },

  introduction: {
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },

  headline: {
    maxWidth: 320,
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxxl,
    lineHeight: Theme.typography.lineHeight.xxxl,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: -0.8,
  },

  description: {
    maxWidth: 340,
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },

  quickActions: {
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.xs,
  },

  sectionTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
  },
});
