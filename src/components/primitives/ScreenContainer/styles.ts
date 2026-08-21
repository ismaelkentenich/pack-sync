import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
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
