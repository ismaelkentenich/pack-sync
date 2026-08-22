import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  cameraWrapper: {
    width: "100%",
    overflow: "hidden",
    height: "40%",
  },
  infoWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "column",
    gap: 8,
  },
  infoHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  infoHeaderItem: {
    flex: 1,
  },
  infoText: {
    fontWeight: "600",
    fontSize: Theme.typography.size.lg,
    color: Theme.colors.neutral[900],
  },
  infoTouchableText: {
    fontWeight: "400",
    fontSize: Theme.typography.size.md,
    color: Theme.colors.primary[600],
  },
  scannedItemContainer: {
    flex: 1,
    width: "100%",
  },
  scannedItemText: {
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.md,
    color: Theme.colors.neutral[700],
  },
  flatlistContainer: {
    paddingBottom: 24,
    gap: 8,
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 16,
  },
  noPermissionTitle: {
    fontSize: Theme.typography.size.lg,
    fontWeight: "500",
    color: Theme.colors.neutral[900],
    textAlign: "center",
  },
  noPermissionButton: {
    width: "100%",
  },
  loadingPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    height: 48,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "20%",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: Theme.typography.size.lg,
    fontWeight: "500",
    color: Theme.colors.neutral[900],
    textAlign: "center",
  },
});
