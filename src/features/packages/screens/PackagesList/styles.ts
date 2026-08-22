import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 24,
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
    paddingBottom: 24,
    paddingTop: 16,
    gap: 8,
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
  },
  headerContainer: {
    gap: 4,
  },
  pickerContainer: {
    color: Theme.colors.neutral[700],
    borderRadius: 8,
  },

  pickerLabel: {
    fontSize: Theme.typography.size.md,
    color: Theme.colors.neutral[700],
    height: "100%",
  },
  pickerWrapper: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.radius.sm,
    height: 48,
    justifyContent: "center",
  },
});
