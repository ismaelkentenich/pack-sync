import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xxs,
    borderRadius: Theme.radius.sm,
  },

  text: {
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
    textTransform: "uppercase",
  },
});
