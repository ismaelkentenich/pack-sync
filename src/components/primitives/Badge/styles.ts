import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },

  text: {
    fontWeight: Theme.typography.weight.semibold,
    textTransform: "uppercase",
  },
});
