import { StyleSheet } from "react-native";
import Theme from "@theme/legacy/legacyTheme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    width: "100%",
  },
  text: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
