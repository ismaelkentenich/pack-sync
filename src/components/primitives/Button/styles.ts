import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  text: {
    fontWeight: Theme.typography.weight.semibold,
  },
});
