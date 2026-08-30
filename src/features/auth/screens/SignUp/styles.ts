import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxxl,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    gap: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.xs,
    zIndex: 1,
  },

  decoration: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
  },

  backButton: {
    alignSelf: "flex-start",
    minHeight: Theme.sizing.touchTarget.minimum,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xxs,
    paddingHorizontal: Theme.spacing.xs,
  },

  backText: {
    color: Theme.colors.primary[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  brandContainer: {
    alignItems: "center",
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
    maxWidth: 320,
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

  loginSection: {
    alignItems: "center",
    gap: Theme.spacing.xxs,
  },

  loginHint: {
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    textAlign: "center",
  },

  loginButton: {
    minHeight: Theme.sizing.touchTarget.minimum,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.sm,
  },

  loginText: {
    color: Theme.colors.primary[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },
});
