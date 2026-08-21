import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  infoContainer: {
    flexDirection: "column",
    flex: 1,
    gap: 8,
    width: "100%",
  },
  infoRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  text: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.fontSizes.sm,
    lineHeight: Theme.fontSizes.md,
  },
  codeText: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.fontSizes.sm,
    lineHeight: Theme.fontSizes.md,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 100,
  },
  buttonItem: {
    height: 36,
    width: "100%",
  },
});
