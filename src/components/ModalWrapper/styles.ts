import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    paddingBottom: 24,
  },
  safeAreaContainer: {
    flex: 1,
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 8,
    zIndex: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
