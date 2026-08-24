import { StyleSheet } from "react-native";
import {
  horizontalScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },

  container: {
    minHeight: verticalScale(56),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(12),
  },

  backButton: {
    position: "absolute",
    left: horizontalScale(4),
    minWidth: Theme.sizing.touchTarget.minimum,
    minHeight: Theme.sizing.touchTarget.minimum,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    flexShrink: 1,
    maxWidth: "70%",
    paddingHorizontal: horizontalScale(8),
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
    textAlign: "center",
  },

  logoutButton: {
    position: "absolute",
    right: horizontalScale(4),
    minWidth: Theme.sizing.touchTarget.minimum,
    minHeight: Theme.sizing.touchTarget.minimum,
    alignItems: "center",
    justifyContent: "center",
  },
});
