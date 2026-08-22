import { StyleSheet } from "react-native";
import Theme from "@theme/legacy/legacyTheme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    gap: 24,
  },
  text: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 8,
    marginTop: 24,
  },
});
