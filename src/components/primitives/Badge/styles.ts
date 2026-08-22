import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xxs,
    borderRadius: Theme.radius.sm,
    alignSelf: "flex-start",
    width: "100%",
  },
  text: {
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.semibold,
    textTransform: "uppercase",
  },
});
