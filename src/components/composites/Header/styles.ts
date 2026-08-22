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
  placeholder: {
    width: Theme.sizing.icon.lg,
  },
  title: {
    color: Theme.colors.neutral[50],
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.semibold,
  },
  logoutButton: {
    position: "absolute",
    right: Theme.spacing.sm,
    padding: Theme.spacing.xs,
  },
});
