import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    color: Theme.colors.neutral[700],
    marginBottom: Theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.neutral[50],
    paddingHorizontal: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: Theme.sizing.control.md,
    color: Theme.colors.neutral[800],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },
  inputError: {
    borderColor: Theme.colors.error[500],
  },
  iconButton: {
    paddingHorizontal: Theme.spacing.xxs,
  },
  errorText: {
    color: Theme.colors.error[500],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
    marginTop: Theme.spacing.xxs,
  },
});
