import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.xl,
  },
  emptyScreenContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyScreenText: {
    textAlign: "center",
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.md,
  },
  card: {
    flex: 1,
    width: "100%",
  },
  cardText: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.md,
  },

  flatlistContainer: {
    paddingBottom: Theme.spacing.xl,
    paddingTop: Theme.spacing.md,
    gap: Theme.spacing.xs,
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
  },
  headerContainer: {
    gap: Theme.spacing.xxs,
  },
  pickerContainer: {
    color: Theme.colors.neutral[700],
    borderRadius: Theme.radius.sm,
  },

  pickerLabel: {
    fontSize: Theme.typography.size.md,
    color: Theme.colors.neutral[700],
    height: "100%",
  },
  pickerWrapper: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.radius.sm,
    height: Theme.sizing.control.md,
    justifyContent: "center",
  },
});
