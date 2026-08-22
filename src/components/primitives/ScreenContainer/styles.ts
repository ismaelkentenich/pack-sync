import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  unsafeArea: {
    flex: 1,
  },

  keyboardAvoiding: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: Theme.spacing.md,
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "60%",
    zIndex: -1,
  },
});
