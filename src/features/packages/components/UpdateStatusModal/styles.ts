import { StyleSheet } from "react-native";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
  },

  header: {
    minHeight: Theme.sizing.control.md,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
  },

  headerContent: {
    flex: 1,
    gap: Theme.spacing.xxs,
    paddingRight: Theme.sizing.control.md,
  },

  title: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xxl,
    lineHeight: Theme.typography.lineHeight.xxl,
    fontWeight: Theme.typography.weight.bold,
  },

  subtitle: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
  },

  packageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.neutral[100],
  },

  packageIconContainer: {
    width: Theme.sizing.control.md,
    height: Theme.sizing.control.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary[100],
  },

  packageInfo: {
    flex: 1,
    gap: Theme.spacing.xxs,
  },

  packageLabel: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
    fontWeight: Theme.typography.weight.medium,
  },

  packageCode: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.semibold,
  },

  currentStateContainer: {
    flexDirection: "row",
    gap: Theme.spacing.md,
  },

  stateItem: {
    flex: 1,
    alignItems: "flex-start",
    gap: Theme.spacing.xs,
  },

  stateLabel: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
    fontWeight: Theme.typography.weight.medium,
  },

  form: {
    gap: Theme.spacing.md,
  },

  field: {
    gap: Theme.spacing.xs,
  },

  fieldLabel: {
    color: Theme.colors.neutral[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  pickerWrapper: {
    minHeight: moderateScale(60),
    maxHeight: moderateScale(120),
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.neutral[50],
  },

  picker: {
    width: "100%",
    color: Theme.colors.neutral[900],
    backgroundColor: Theme.colors.neutral[50],
  },

  pickerItem: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.md,
  },

  syncingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary[100],
  },

  syncingText: {
    color: Theme.colors.primary[700],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.medium,
  },

  actions: {
    gap: Theme.spacing.sm,
    paddingTop: Theme.spacing.xs,
  },
});
