import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    width: "100%",
  },
  text: {
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.semibold,
    textTransform: "uppercase",
  },
});
