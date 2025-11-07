import { StyleSheet } from "react-native";
import Theme from "../../../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },

  camera: {
    flex: 1,
  },
  cameraWrapper: {
    width: "100%",
    overflow: "hidden",
    height: "45%",
  },
  infoWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  infoText: {
    paddingVertical: 8,
    fontWeight: "bold",
    fontSize: Theme.fontSizes.lg,
    color: Theme.colors.neutral[900],
  },
  scannedItemContainer: {
    flex: 1,
    width: "100%",
  },
  scannedItemText: {
    fontSize: Theme.fontSizes.sm,
    lineHeight: Theme.fontSizes.md,
    color: Theme.colors.neutral[700],
  },
  flatlistContainer: {
    paddingBottom: 24,
    gap: 8,
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
  },
});
