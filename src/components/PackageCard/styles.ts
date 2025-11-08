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
    flex: 1,
    flexDirection: "column",
    gap: 8,
    width: "100%",
    alignItems: "flex-end",
  },
  buttonItem: {
    height: 36,
    width: "100%",
  },
});
