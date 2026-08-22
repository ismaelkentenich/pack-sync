import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    height: Theme.sizing.control.lg,
    backgroundColor: Theme.colors.primary[600],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.xs,
  },

  backButton: {
    position: "absolute",
    left: Theme.spacing.sm,
    padding: Theme.spacing.xs,
  },

  title: {
    color: Theme.colors.neutral[50],
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
    textAlign: "center",
  },

  logoutButton: {
    position: "absolute",
    right: Theme.spacing.sm,
    padding: Theme.spacing.xs,
  },
});
