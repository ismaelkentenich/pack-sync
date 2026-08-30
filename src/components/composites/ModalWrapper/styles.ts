import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Theme.spacing.xl,
  },

  safeAreaContainer: {
    flex: 1,
  },

  keyboardAvoiding: {
    flex: 1,
  },

  dismissKeyboardArea: {
    flex: 1,
  },

  closeIcon: {
    position: "absolute",
    top: 0,
    right: Theme.spacing.xs,
    zIndex: 10,
    width: Theme.sizing.control.md,
    height: Theme.sizing.control.md,
    justifyContent: "center",
    alignItems: "center",
  },

  closeIconContent: {
    alignItems: "center",
    justifyContent: "center",
  },
});
