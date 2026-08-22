import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 24,
  },
  userInfoText: {
    fontSize: Theme.typography.size.lg,
    textAlign: "center",
    color: Theme.colors.neutral[50],
    fontWeight: Theme.typography.weight.semibold,
  },
  headerContainer: {
    paddingVertical: 24,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 4,
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
    gap: 8,
  },
  cardText: {
    color: Theme.colors.neutral[700],
  },
});
