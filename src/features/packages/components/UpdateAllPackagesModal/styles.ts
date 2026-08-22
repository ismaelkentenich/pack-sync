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
    lineHeight: Theme.typography.lineHeight.xl,
  },
  text: {
    color: Theme.colors.neutral[800],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.lg,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.radius.xxs,
    overflow: "hidden",
    height: Theme.sizing.control.md,
  },
  pickerContainer: {
    color: Theme.colors.neutral[800],
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.radius.sm,
  },
  pickerItem: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.lg,
    color: Theme.colors.neutral[800],
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  innerContainer: {
    gap: Theme.spacing.xxs,
  },
});
