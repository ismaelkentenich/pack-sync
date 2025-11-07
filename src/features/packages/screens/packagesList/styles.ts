import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 24,
  },
  emptyScreenText: {
    textAlign: "center",
    color: Theme.colors.neutral[700],
  },
  card: {
    flex: 1,
    width: "100%",
  },
  cardText: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.fontSizes.sm,
    lineHeight: Theme.fontSizes.md,
  },
  flatlistContainer: {
    paddingBottom: 24,
    paddingTop: 16,
    gap: 8,
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
  },
});
