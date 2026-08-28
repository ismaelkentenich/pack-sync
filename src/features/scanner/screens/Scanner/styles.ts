import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@theme/responsiveScale";
import Theme from "@theme/theme";

const CAMERA_HEIGHT = verticalScale(220);
const SCAN_FRAME_WIDTH = horizontalScale(238);
const SCAN_FRAME_HEIGHT = verticalScale(100);
const CORNER_SIZE = moderateScale(28);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: Theme.colors.neutral[100],
  },

  cameraSection: {
    gap: verticalScale(Theme.spacing.md),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingTop: verticalScale(Theme.spacing.xs),
  },

  cameraWrapper: {
    width: "100%",
    height: CAMERA_HEIGHT,
    overflow: "hidden",
    borderRadius: moderateScale(Theme.radius.xl),
    backgroundColor: Theme.colors.neutral[900],
  },

  camera: {
    flex: 1,
  },

  torchButton: {
    position: "absolute",
    top: verticalScale(Theme.spacing.xs),
    right: horizontalScale(Theme.spacing.xs),
    zIndex: 10,
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  torchButtonActive: {
    backgroundColor: Theme.colors.secondary[400],
    borderColor: Theme.colors.secondary[300],
  },

  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },

  scanFrame: {
    width: SCAN_FRAME_WIDTH,
    height: SCAN_FRAME_HEIGHT,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(Theme.radius.lg),
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },

  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Theme.colors.secondary[400],
  },

  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: moderateScale(10),
  },

  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: moderateScale(10),
  },

  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: moderateScale(10),
  },

  cornerBottomRight: {
    right: 0,
    bottom: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: moderateScale(10),
  },

  scanLine: {
    width: "76%",
    height: verticalScale(Theme.spacing.xxxs),
    borderRadius: Theme.radius.pill,
    backgroundColor: Theme.colors.primary[400],
  },

  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(Theme.spacing.md),
    paddingHorizontal: horizontalScale(Theme.spacing.xs),
    paddingVertical: verticalScale(Theme.spacing.xs),
    borderRadius: moderateScale(Theme.radius.lg),
    backgroundColor: Theme.colors.primary[100],
  },

  instructionIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(Theme.radius.lg),
    backgroundColor: Theme.colors.neutral[50],
  },

  instructionContent: {
    flex: 1,
    minWidth: 0,
    gap: verticalScale(Theme.spacing.xxxs),
  },

  instructionTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  instructionDescription: {
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.lineHeight.xs,
  },

  sessionSection: {
    flex: 1,
    gap: verticalScale(Theme.spacing.sm),
    paddingTop: verticalScale(Theme.spacing.md),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingBottom: verticalScale(Theme.spacing.md),
  },

  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(Theme.spacing.md),
  },

  sessionTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
  },

  sessionCount: {
    marginTop: verticalScale(Theme.spacing.xxxs),
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
  },

  updateAllButton: {
    minHeight: verticalScale(
      Theme.sizing.touchTarget.minimum,
    ),
    justifyContent: "center",
    paddingHorizontal: horizontalScale(Theme.spacing.xs),
  },

  updateAllText: {
    color: Theme.colors.primary[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    fontWeight: Theme.typography.weight.semibold,
  },

  actionDisabled: {
    opacity: 0.5,
  },

  listContent: {
    paddingTop: verticalScale(Theme.spacing.xxs),
    paddingBottom: verticalScale(Theme.spacing.xs),
  },

  cardWrapper: {
    marginBottom: verticalScale(Theme.spacing.sm),
  },

  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(Theme.spacing.xs),
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(Theme.spacing.xs),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingBottom: verticalScale(Theme.spacing.md),
  },

  emptyIconContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(Theme.spacing.xxs),
    borderRadius: moderateScale(Theme.radius.lg),
    backgroundColor: Theme.colors.primary[100],
  },

  emptyTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.lg,
    lineHeight: Theme.typography.lineHeight.lg,
    fontWeight: Theme.typography.weight.semibold,
    textAlign: "center",
  },

  emptyDescription: {
    maxWidth: "80%",
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.lineHeight.sm,
    textAlign: "center",
  },

  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(Theme.spacing.md),
    paddingHorizontal: horizontalScale(Theme.spacing.md),
    paddingBottom: verticalScale(Theme.spacing.md),
    backgroundColor: Theme.colors.neutral[100],
  },

  permissionIconContainer: {
    width: moderateScale(72),
    height: moderateScale(72),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(Theme.radius.lg),
    backgroundColor: Theme.colors.primary[100],
  },

  permissionTextContainer: {
    alignItems: "center",
    gap: verticalScale(Theme.spacing.xs),
  },

  permissionTitle: {
    color: Theme.colors.neutral[900],
    fontSize: Theme.typography.size.xl,
    lineHeight: Theme.typography.lineHeight.xl,
    fontWeight: Theme.typography.weight.bold,
    textAlign: "center",
  },

  permissionDescription: {
    maxWidth: horizontalScale(300),
    color: Theme.colors.neutral[600],
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.lineHeight.md,
    textAlign: "center",
  },

  permissionButton: {
    width: "100%",
    maxWidth: horizontalScale(320),
  },
});
