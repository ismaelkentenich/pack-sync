import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
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
    top: 56,
    height: "60%",
    zIndex: -1,
  },
});
