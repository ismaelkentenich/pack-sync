import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
    justifyContent: "center",
    gap: Theme.spacing.xl,
  },
  text: {
    fontSize: Theme.typography.size.xxl,
    fontWeight: Theme.typography.weight.semibold,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.xl,
  },
});
