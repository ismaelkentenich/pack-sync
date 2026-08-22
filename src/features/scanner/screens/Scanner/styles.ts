import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Theme.spacing.xs,
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
    paddingHorizontal: Theme.spacing.md,
  },
  headerContainer: {
    flexDirection: "column",
    gap: Theme.spacing.xs,
  },
  infoHeader: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  infoHeaderItem: {
    flex: 1,
  },
  infoText: {
    fontWeight: Theme.typography.weight.semibold,
    fontSize: Theme.typography.size.lg,
    color: Theme.colors.neutral[900],
  },
  infoTouchableText: {
    fontWeight: Theme.typography.weight.regular,
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
    paddingBottom: Theme.spacing.xl,
    gap: Theme.spacing.xs,
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
  },
  noPermissionTitle: {
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.medium,
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
    gap: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
  },
  buttonContainer: {
    height: 48,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignSelf: "center",
    paddingHorizontal: Theme.spacing.md,
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
    gap: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
  },
  emptyText: {
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.neutral[900],
    textAlign: "center",
  },
});
