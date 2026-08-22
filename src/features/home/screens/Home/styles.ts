import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.xl,
  },
  userInfoText: {
    fontSize: Theme.typography.size.lg,
    textAlign: "center",
    color: Theme.colors.neutral[50],
    fontWeight: Theme.typography.weight.semibold,
  },
  headerContainer: {
    paddingVertical: Theme.spacing.xl,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: Theme.spacing.xxs,
  },
  headerText: {
    fontSize: Theme.typography.size.xxxl,
    textAlign: "center",
    color: Theme.colors.neutral[50],
    fontWeight: Theme.typography.weight.bold,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  cardText: {
    color: Theme.colors.neutral[700],
  },
});
