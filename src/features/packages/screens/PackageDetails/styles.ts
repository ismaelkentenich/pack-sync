import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  cardContainer: {
    gap: Theme.spacing.xl,
  },
  detailTitle: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.xl,
    lineHeight: Theme.typography.lineHeight.xl,
    fontWeight: Theme.typography.weight.semibold,
  },
  detailText: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    paddingVertical: Theme.spacing.xxs,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
    alignContent: "center",
    alignItems: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: Theme.spacing.xs,
    alignContent: "center",
    alignItems: "center",
  },
  button: {
    height: 30,
    paddingHorizontal: Theme.spacing.sm,
  },
});
