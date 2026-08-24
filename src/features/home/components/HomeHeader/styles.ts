import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
  },

  userContainer: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
    alignItems: "center",
  },

  userAvatar: {
    width: Theme.sizing.control.sm,
    height: Theme.sizing.control.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.pill,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    backgroundColor: Theme.colors.primary[800],
  },

  userContent: {
    flexDirection: "column",
    gap: Theme.spacing.none,
  },

  greeting: {
    color: Theme.colors.primary[400],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
  },

  email: {
    color: Theme.colors.primary[800],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },
});
