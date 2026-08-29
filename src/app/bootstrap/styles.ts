import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    paddingHorizontal: horizontalScale(24),
    gap: moderateScale(16),
  },
  errorTitle: {
    fontSize: Theme.typography.size.xl,
    fontWeight: Theme.typography.weight.bold,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: Theme.typography.size.md,
    textAlign: "center",
    lineHeight: Theme.typography.lineHeight.md,
  },
  retryButton: {
    marginTop: verticalScale(8),
    minWidth: horizontalScale(200),
  },
});
