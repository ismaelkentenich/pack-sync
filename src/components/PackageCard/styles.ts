import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "100%",
  },
  infoContainer: {
    flexDirection: "column",
  },
  text: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.fontSizes.sm,
    lineHeight: Theme.fontSizes.md,
  },
});
