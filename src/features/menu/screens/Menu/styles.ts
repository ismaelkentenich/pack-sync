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
});
