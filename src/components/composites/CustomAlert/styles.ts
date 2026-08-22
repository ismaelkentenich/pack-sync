import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.md,
  },

  container: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },

  content: {
    gap: Theme.spacing.xs,
  },

  title: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
    textAlign: "center",
  },

  message: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    textAlign: "center",
  },

  actions: {
    marginTop: Theme.spacing.xs,
  },
});
