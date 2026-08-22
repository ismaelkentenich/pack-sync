import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
  },

  userContent: {
    flex: 1,
    gap: Theme.spacing.xxs,
  },

  greeting: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
  },

  email: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },

  logoutButton: {
    width: Theme.sizing.control.md,
    height: Theme.sizing.control.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.neutral[100],
  },
});
