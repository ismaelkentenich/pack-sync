import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxxl,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    gap: Theme.spacing.xl,
    zIndex: 1,
    paddingHorizontal: Theme.spacing.xs,
  },

  decoration: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
  },

  decorationLarge: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -110,
    top: -70,
    backgroundColor: Theme.colors.secondary[400],
    opacity: 0.18,
  },

  decorationSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    left: -55,
    bottom: 30,
    backgroundColor: Theme.colors.primary[200],
    opacity: 0.22,
  },

  brandContainer: {
    alignItems: "center",
    gap: Theme.spacing.sm,
  },

  brandIconContainer: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.xl,
    backgroundColor: Theme.colors.secondary[400],
  },

  introduction: {
    alignItems: "center",
    gap: Theme.spacing.xs,
  },

  title: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxxl,
    lineHeight: Theme.typography.lineHeight.xxxl,
    fontWeight: Theme.typography.weight.bold,
    textAlign: "center",
    letterSpacing: -0.8,
  },

  description: {
    maxWidth: 310,
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    textAlign: "center",
  },

  form: {
    width: "100%",
    gap: Theme.spacing.xxl,
  },

  formInputWrapper: {
    width: "100%",
    gap: Theme.spacing.md,
  },

  signupSection: {
    alignItems: "center",
    gap: Theme.spacing.xs,
  },

  signupHint: {
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    textAlign: "center",
  },

  signupButton: {
    minHeight: Theme.sizing.touchTarget.minimum,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xxs,
    paddingHorizontal: Theme.spacing.sm,
  },

  signupText: {
    color: Theme.colors.primary[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },
});
