import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Theme.colors.neutral[700],
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.neutral[50],
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    color: Theme.colors.neutral[800],
  },
  inputError: {
    borderColor: Theme.colors.attention[500],
  },
  iconButton: {
    paddingHorizontal: 4,
  },
  errorText: {
    color: Theme.colors.attention[500],
    fontSize: 12,
    marginTop: 4,
  },
});
