import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },

  infoContainer: {
    flex: 1,
    gap: Theme.spacing.xs,
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },

  text: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.md,
  },

  codeText: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },

  buttonContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    gap: Theme.spacing.xs,
  },

  buttonItem: {
    width: "100%",
  },
});
