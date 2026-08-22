import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    padding: 16,
  },
  title: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: "bold",
    color: Theme.colors.neutral[800],
  },
  text: {
    color: Theme.colors.neutral[800],
    fontSize: Theme.fontSizes.md,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: 4,
    overflow: "hidden",
  },
  pickerContainer: {
    color: Theme.colors.neutral[800],
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: 8,
    height: 48,
  },
  pickerItem: {
    flex: 1,
    height: 48,
  },
  pickerLabel: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.neutral[800],
  },
  buttonContainer: {
    gap: 16,
    paddingVertical: 16,
  },
});
