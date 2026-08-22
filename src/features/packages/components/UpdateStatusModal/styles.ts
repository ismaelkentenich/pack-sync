import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.semibold,
    color: Theme.colors.neutral[800],
  },
  text: {
    color: Theme.colors.neutral[800],
    fontSize: Theme.typography.size.md,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.radius.xxs,
    overflow: "hidden",
  },
  pickerContainer: {
    color: Theme.colors.neutral[800],
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.radius.sm,
    height: 48,
  },
  pickerItem: {
    flex: 1,
    height: 48,
  },
  pickerLabel: {
    fontSize: Theme.typography.size.md,
    color: Theme.colors.neutral[800],
  },
  buttonContainer: {
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
});
