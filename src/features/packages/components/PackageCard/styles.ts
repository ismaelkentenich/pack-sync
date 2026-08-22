import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    gap: Theme.spacing.xs,
  },
  infoContainer: {
    flexDirection: "column",
    flex: 1,
    gap: Theme.spacing.xs,
    width: "100%",
  },
  infoRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    width: "100%",
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
    gap: Theme.spacing.xs,
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 100,
  },
  buttonItem: {
    height: 36,
    width: "100%",
  },
});
