import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },

  card: {
    flex: 1,
    minHeight: 104,
    justifyContent: "center",
    gap: Theme.spacing.xxs,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
  },

  value: {
    fontSize: Theme.typography.size.xxl,
    lineHeight: Theme.typography.lineHeight.xxl,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: -0.4,
  },

  label: {
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
  },
});
