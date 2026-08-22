import { StyleSheet } from "react-native";
import Theme from "@theme/legacy/legacyTheme";

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    shadowColor: Theme.colors.neutral[950],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
