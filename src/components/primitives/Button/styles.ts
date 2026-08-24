import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Theme.radius.lg,
    paddingHorizontal: Theme.spacing.xxxs,
    alignContent: "center",
  },

  text: {
    fontWeight: Theme.typography.weight.semibold,
    textAlign: "center",
  },
});
