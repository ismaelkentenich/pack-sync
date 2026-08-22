import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: Theme.colors.primary[600],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  backButton: {
    position: "absolute",
    left: 12,
    padding: 8,
  },
  placeholder: {
    width: 32,
  },
  title: {
    color: Theme.colors.neutral[50],
    fontSize: Theme.typography.size.lg,
    fontWeight: "600",
  },
  logoutButton: {
    position: "absolute",
    right: 12,
    padding: 8,
  },
});
