import { StyleSheet } from "react-native";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  fieldContainer: {
    position: "relative",
    width: "100%",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
    minHeight: moderateScale(Theme.sizing.control.lg),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: moderateScale(Theme.radius.lg),
    paddingHorizontal: moderateScale(Theme.spacing.md),
  },

  inputWrapperFocused: {
    borderWidth: 2,
  },

  input: {
    flex: 1,
    minHeight: moderateScale(Theme.sizing.control.lg),
    paddingTop: moderateScale(Theme.spacing.none),
    paddingBottom: moderateScale(Theme.spacing.xs),
    paddingHorizontal: moderateScale(Theme.spacing.none),
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
  },

  inputWithFloatingLabel: {
    paddingTop: moderateScale(Theme.spacing.xs),
  },

  labelContainer: {
    position: "absolute",
    top: moderateScale(Theme.spacing.none),
    left: moderateScale(Theme.spacing.md),
    zIndex: 10,
    paddingHorizontal: moderateScale(Theme.spacing.xxs),
  },

  label: {
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.md,
    fontWeight: Theme.typography.weight.medium,
  },

  iconButton: {
    minWidth: moderateScale(
      Theme.sizing.touchTarget.minimum,
    ),
    minHeight: moderateScale(
      Theme.sizing.touchTarget.minimum,
    ),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(-Theme.spacing.xs),
    marginLeft: moderateScale(Theme.spacing.xxs),
  },

  supportingText: {
    marginTop: moderateScale(Theme.spacing.xxs),
    paddingHorizontal: moderateScale(Theme.spacing.sm),
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.xs,
  },
});
