import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  card: {
    position: "relative",
    overflow: "hidden",
  },

  horizontal: {
    flexDirection: "row",
    alignItems: "center",
  },

  vertical: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.lg,
    flexShrink: 0,
  },

  content: {
    flex: 1,
    gap: Theme.spacing.xxs,
  },

  title: {
    fontWeight: Theme.typography.weight.semibold,
  },

  description: {
    flexShrink: 1,
  },

  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xxs,
  },

  actionText: {
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  decoration: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "45%",
    overflow: "hidden",
  },

  decorationLarge: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    right: -40,
    top: -50,
    backgroundColor: Theme.colors.neutral[50],
    opacity: 0.06,
  },

  decorationSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    right: 25,
    bottom: -35,
    backgroundColor: Theme.colors.secondary[400],
    opacity: 0.2,
  },
});
