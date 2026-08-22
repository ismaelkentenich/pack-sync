import { StyleSheet } from "react-native";
import Theme from "@theme/legacy/legacyTheme";

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
    lineHeight: Theme.fontSizes.xl,
  },
  text: {
    color: Theme.colors.neutral[800],
    fontSize: Theme.fontSizes.md,
    lineHeight: Theme.fontSizes.lg,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: 4,
    overflow: "hidden",
    height: 48,
  },
  pickerContainer: {
    color: Theme.colors.neutral[800],
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: 8,
  },
  pickerItem: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: Theme.fontSizes.md,
    lineHeight: Theme.fontSizes.lg,
    color: Theme.colors.neutral[800],
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    gap: 16,
    paddingVertical: 16,
  },
  innerContainer: {
    gap: 4,
  },
});
