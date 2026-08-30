import { StyleSheet } from "react-native";
import {
  horizontalScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    minHeight: verticalScale(72),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    gap: Theme.spacing.md,
  },

  iconContainer: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primary[100],
  },

  destructiveIconContainer: {
    backgroundColor: Theme.colors.error[50],
  },

  content: {
    flex: 1,
    gap: Theme.spacing.xxs,
  },

  title: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },

  destructiveTitle: {
    color: Theme.colors.error[700],
  },

  description: {
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
  },
});
