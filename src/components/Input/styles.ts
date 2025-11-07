import Theme from "@theme/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
    gap: 4,
  },
  label: {
    fontSize: Theme.fontSizes.md,
    fontWeight: "500",
    color: Theme.colors.neutral[900],
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.neutral[900],
    backgroundColor: Theme.colors.neutral[100],
  },
  inputError: {
    borderColor: Theme.colors.attention[500],
  },
  errorText: {
    color: Theme.colors.attention[500],
    fontSize: Theme.fontSizes.sm,
    marginTop: 4,
  },
});
