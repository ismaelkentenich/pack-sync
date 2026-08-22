import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
    marginBottom: Theme.spacing.xs,
  },

  inputWrapper: {
    height: Theme.sizing.control.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Theme.radius.lg,
    paddingHorizontal: Theme.spacing.sm,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
  },

  iconButton: {
    padding: Theme.spacing.xxs,
    marginLeft: Theme.spacing.xxs,
  },

  errorText: {
    marginTop: Theme.spacing.xxs,
    color: Theme.colors.error[500],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
  },
});
