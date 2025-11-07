import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: Theme.colors.primary[600],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 32,
  },
  title: {
    color: Theme.colors.neutral[50],
    fontSize: Theme.fontSizes.xl,
    fontWeight: "600",
  },
});
