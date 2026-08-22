import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    gap: 24,
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
    paddingVertical: 4,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignContent: "center",
    alignItems: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
    alignContent: "center",
    alignItems: "center",
  },
  button: {
    height: 30,
    paddingHorizontal: 12,
  },
});
