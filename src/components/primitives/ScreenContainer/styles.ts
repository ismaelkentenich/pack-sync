import { StyleSheet } from "react-native";
import { verticalScale } from "@theme/responsiveScale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  keyboardAvoiding: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(16),
  },

  background: {
    ...StyleSheet.absoluteFill,
    zIndex: -1,
  },
});
