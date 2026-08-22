import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  button: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Theme.radius.lg,
    paddingHorizontal: Theme.spacing.md,
  },

  text: {
    fontWeight: Theme.typography.weight.semibold,
    textAlign: "center",
  },
});
