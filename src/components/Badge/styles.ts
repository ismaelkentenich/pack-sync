import Theme from "@theme/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
 container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: "600",
  },
});
