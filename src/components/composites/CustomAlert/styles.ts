import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.lg,
    alignItems: "center",
  },
  title: {
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.semibold,
    marginBottom: Theme.spacing.sm,
    color: Theme.colors.neutral[900],
  },
  message: {
    fontSize: Theme.typography.size.md,
    textAlign: "center",
    marginBottom: Theme.spacing.lg,
    color: Theme.colors.neutral[700],
  },
  button: {
    backgroundColor: Theme.colors.primary[600],
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.sm,
  },
  buttonText: {
    color: Theme.colors.neutral[50],
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.semibold,
  },
});
