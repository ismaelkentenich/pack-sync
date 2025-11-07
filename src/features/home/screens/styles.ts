import { StyleSheet } from "react-native";
import Theme from "../../../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: "bold",
    textAlign: "center",
  },
  userInfoText: {
    fontSize: Theme.fontSizes.lg,
    marginTop: 16,
    textAlign: "center",
  },
});
