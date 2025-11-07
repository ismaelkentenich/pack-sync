import { StyleSheet } from "react-native";
import Theme from "../../../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 24,
  },
  pageTitle: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: "bold",
    textAlign: "center",
  },
});
