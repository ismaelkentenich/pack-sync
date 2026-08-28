import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import {
  CameraOff,
  Flashlight,
  FlashlightOff,
  PackageSearch,
  ScanLine,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "@components/primitives/Button";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { Routes } from "@config/routes";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { PackageCard } from "@features/packages/components/PackageCard";
import UpdateAllPackagesModal from "@features/packages/components/UpdateAllPackagesModal";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translatePackageFeedback } from "@features/packages/utils/getPackageErrorFeedback";
import { useMainTabNavigation } from "@hooks/useMainTabNavigation";
import { useShowAlert } from "@store/useAlertStore";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { styles } from "./styles";
import type { Package } from "@features/packages/domain/package.types";
import type { ListRenderItemInfo } from "@shopify/flash-list";

export default function ScanScreen() {
  const { t } = useTranslation();

  const navigation = useMainTabNavigation();

  const updateAllModalRef = useRef<BottomSheetModal>(null);

  const scannedCodesRef = useRef<Set<string>>(new Set());

  const userId = useAuthStore((state) => state.user?.id);

  const showAlert = useShowAlert((state) => state.show);

  const isSyncingSession = usePackageStore(
    (state) => state.isSyncingSession,
  );

  const currentSessionPackages = usePackageStore(
    (state) => state.currentSessionPackages,
  );

  const feedback = usePackageStore(
    (state) => state.feedback,
  );

  const scanPackage = usePackageStore(
    (state) => state.scanPackage,
  );

  const loadPackages = usePackageStore(
    (state) => state.loadPackages,
  );

  const resetSession = usePackageStore(
    (state) => state.resetSession,
  );

  const removeFromSession = usePackageStore(
    (state) => state.removeFromSession,
  );

  const clearFeedback = usePackageStore(
    (state) => state.clearFeedback,
  );

  const sendAllCurrentSessionPackages = usePackageStore(
    (state) => state.sendAllCurrentSessionPackages,
  );

  const [permission, requestPermission] =
    useCameraPermissions();

  const [isTorchOn, setIsTorchOn] = useState(false);

  const sessionCount = currentSessionPackages.length;

  const hasPackages = sessionCount > 0;

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsTorchOn(false);
      };
    }, []),
  );

  const handleToggleTorch = useCallback(() => {
    setIsTorchOn((prev) => {
      const next = !prev;
      void Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );
      return next;
    });
  }, []);

  const openUpdateAllModal = useCallback(() => {
    updateAllModalRef.current?.present();
  }, []);

  const closeUpdateAllModal = useCallback(() => {
    updateAllModalRef.current?.close();
  }, []);

  const handleBarCodeScanned = useCallback(
    async (result: BarcodeScanningResult) => {
      if (!userId) {
        console.warn("[Scanner] ignored: userId missing");
        return;
      }

      const data = result.data.trim();

      if (!data) {
        console.warn("[Scanner] ignored: empty barcode");
        return;
      }

      if (scannedCodesRef.current.has(data)) {
        console.warn("[Scanner] ignored: already scanned", {
          data,
        });

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        );

        showAlert(
          translatePackageFeedback(t, {
            key: "packages.feedback.alreadyScanned",
          }),
          "info",
        );

        return;
      }

      scannedCodesRef.current.add(data);

      try {
        await scanPackage(data, userId);
      } catch (error) {
        console.error("[Scanner] scanPackage failed", {
          code: data,
          error,
        });
      }
    },
    [scanPackage, showAlert, t, userId],
  );

  const handleSyncSession = useCallback(() => {
    if (!userId || isSyncingSession || !hasPackages) {
      return;
    }

    sendAllCurrentSessionPackages(userId);
  }, [
    hasPackages,
    isSyncingSession,
    sendAllCurrentSessionPackages,
    userId,
  ]);

  const handleViewAll = useCallback(() => {
    navigation.navigate(Routes.Packages);
  }, [navigation]);

  const handleRemoveFromSession = useCallback(
    (pkg: Package) => {
      if (!userId) {
        return;
      }

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );

      scannedCodesRef.current.delete(pkg.code);

      removeFromSession(pkg, userId);
    },
    [removeFromSession, userId],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Package>) => (
      <View
        testID={`scannerSessionItem-${
          item.id ?? item.code
        }`}
        style={styles.cardWrapper}
      >
        <PackageCard
          item={item}
          pressable={false}
          showRemoveButton
          onPressRemove={() =>
            handleRemoveFromSession(item)
          }
        />
      </View>
    ),
    [handleRemoveFromSession],
  );

  const keyExtractor = useCallback(
    (item: Package) => String(item.id ?? item.code),
    [],
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    loadPackages(userId);
  }, [loadPackages, userId]);

  useEffect(() => {
    if (feedback.success) {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );

      showAlert(
        translatePackageFeedback(t, feedback.success),
        "success",
      );

      clearFeedback();

      return;
    }

    if (feedback.error) {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error,
      );

      showAlert(
        translatePackageFeedback(t, feedback.error),
        "error",
      );

      clearFeedback();
    }
  }, [
    clearFeedback,
    feedback.error,
    feedback.success,
    showAlert,
    t,
  ]);

  useEffect(() => {
    if (
      permission &&
      !permission.granted &&
      permission.canAskAgain &&
      permission.status === "undetermined"
    ) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      resetSession();

      clearFeedback();

      scannedCodesRef.current.clear();
    }, [clearFeedback, resetSession]),
  );

  if (!permission) {
    return (
      <ScreenContainer
        testID="scannerScreen"
        headerTitle={t("scanner.title")}
        headerVariant="neutral"
        backgroundColorVariant="neutral100"
        safeAreaEdges={["bottom"]}
      >
        <View
          testID="scannerPermissionLoading"
          style={styles.permissionContainer}
        >
          <View style={styles.permissionIconContainer}>
            <ScanLine
              size={moderateScale(Theme.sizing.icon.lg)}
              color={Theme.colors.primary[600]}
            />
          </View>

          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>
              {t("scanner.preparingCamera")}
            </Text>

            <Text style={styles.permissionDescription}>
              {t("scanner.requestingPermission")}
            </Text>
          </View>

          <ActivityIndicator
            size="large"
            color={Theme.colors.primary[600]}
          />
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    const canAskAgain = permission.canAskAgain;
    const handlePermissionPress = canAskAgain
      ? requestPermission
      : () => {
          Linking.openSettings();
        };

    return (
      <ScreenContainer
        testID="scannerScreen"
        headerTitle={t("scanner.title")}
        headerVariant="neutral"
        backgroundColorVariant="neutral100"
        safeAreaEdges={["bottom"]}
      >
        <View
          testID="scannerPermissionDenied"
          style={styles.permissionContainer}
        >
          <View style={styles.permissionIconContainer}>
            <CameraOff
              size={moderateScale(Theme.sizing.icon.lg)}
              color={Theme.colors.primary[600]}
            />
          </View>

          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>
              {t("scanner.permissionTitle")}
            </Text>

            <Text style={styles.permissionDescription}>
              {canAskAgain
                ? t("scanner.permissionRequired")
                : t(
                    "scanner.permissionRequiredPermanently",
                  )}
            </Text>
          </View>

          <View style={styles.permissionButton}>
            <Button
              testID="scannerGrantPermissionButton"
              title={
                canAskAgain
                  ? t("scanner.grantPermission")
                  : t("scanner.openSettings")
              }
              onPress={handlePermissionPress}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      testID="scannerScreen"
      headerTitle={t("scanner.title")}
      headerVariant="neutral"
      showBackButton={false}
      backgroundColorVariant="neutral100"
      withSafeArea={false}
    >
      <View
        testID="scannerContainer"
        style={styles.container}
      >
        <View
          testID="scannerCameraSection"
          style={styles.cameraSection}
        >
          <View
            testID="scannerCameraWrapper"
            style={styles.cameraWrapper}
          >
            <CameraView
              testID="scannerCamera"
              style={styles.camera}
              facing="back"
              enableTorch={isTorchOn}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "ean13", "code128"],
              }}
              onBarcodeScanned={handleBarCodeScanned}
            />

            <TouchableOpacity
              testID="scannerTorchButton"
              accessibilityRole="button"
              accessibilityLabel={
                isTorchOn
                  ? t("scanner.turnTorchOff")
                  : t("scanner.turnTorchOn")
              }
              accessibilityState={{ checked: isTorchOn }}
              style={[
                styles.torchButton,
                isTorchOn && styles.torchButtonActive,
              ]}
              onPress={handleToggleTorch}
              activeOpacity={0.75}
            >
              {isTorchOn ? (
                <Flashlight
                  size={moderateScale(20)}
                  color={Theme.colors.neutral[900]}
                />
              ) : (
                <FlashlightOff
                  size={moderateScale(20)}
                  color={Theme.colors.neutral[0]}
                />
              )}
            </TouchableOpacity>

            <View
              pointerEvents="none"
              testID="scannerOverlay"
              style={styles.overlay}
            >
              <View style={styles.scanFrame}>
                <View
                  style={[
                    styles.corner,
                    styles.cornerTopLeft,
                  ]}
                />

                <View
                  style={[
                    styles.corner,
                    styles.cornerTopRight,
                  ]}
                />

                <View
                  style={[
                    styles.corner,
                    styles.cornerBottomLeft,
                  ]}
                />

                <View
                  style={[
                    styles.corner,
                    styles.cornerBottomRight,
                  ]}
                />

                <View style={styles.scanLine} />
              </View>
            </View>
          </View>

          <View
            testID="scannerInstruction"
            style={styles.instructionContainer}
          >
            <View style={styles.instructionIconContainer}>
              <ScanLine
                size={moderateScale(Theme.sizing.icon.sm)}
                color={Theme.colors.primary[600]}
              />
            </View>

            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>
                {t("scanner.instructionTitle")}
              </Text>

              <Text style={styles.instructionDescription}>
                {t("scanner.instructionDescription")}
              </Text>
            </View>
          </View>
        </View>

        <View
          testID="scannerSessionSection"
          style={styles.sessionSection}
        >
          <View style={styles.sessionHeader}>
            <View>
              <Text
                testID="scannerSessionTitle"
                style={styles.sessionTitle}
              >
                {t("scanner.sessionTitle")}
              </Text>

              <Text
                testID="scannerSessionCount"
                style={styles.sessionCount}
              >
                {t("scanner.sessionCount", {
                  count: sessionCount,
                })}
              </Text>
            </View>

            {hasPackages ? (
              <TouchableOpacity
                testID="scannerUpdateAllButton"
                accessibilityRole="button"
                activeOpacity={0.7}
                disabled={isSyncingSession}
                onPress={openUpdateAllModal}
                style={[
                  styles.updateAllButton,

                  isSyncingSession && styles.actionDisabled,
                ]}
              >
                <Text style={styles.updateAllText}>
                  {t("packages.actions.updateAll")}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {hasPackages ? (
            <>
              <FlashList
                testID="scannerSessionList"
                data={currentSessionPackages}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />

              <View style={styles.buttonsContainer}>
                <Button
                  testID="scannerViewAllButton"
                  title={t("packages.actions.viewAll")}
                  onPress={handleViewAll}
                  variant="primary"
                  size="sm"
                />

                <Button
                  testID="scannerSyncButton"
                  title={t("packages.actions.syncPackages")}
                  loading={isSyncingSession}
                  disabled={isSyncingSession}
                  onPress={handleSyncSession}
                  variant="accent"
                  size="sm"
                />
              </View>
            </>
          ) : (
            <View
              testID="scannerEmptyState"
              style={styles.emptyState}
            >
              <View style={styles.emptyIconContainer}>
                <PackageSearch
                  size={moderateScale(Theme.sizing.icon.lg)}
                  color={Theme.colors.primary[600]}
                />
              </View>

              <Text style={styles.emptyTitle}>
                {t("scanner.emptyTitle")}
              </Text>

              <Text style={styles.emptyDescription}>
                {t("scanner.emptyDescription")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {userId ? (
        <UpdateAllPackagesModal
          ref={updateAllModalRef}
          handleCloseModal={closeUpdateAllModal}
          onSuccessNavigate={() =>
            navigation.navigate(Routes.Packages)
          }
          userId={userId}
        />
      ) : null}
    </ScreenContainer>
  );
}
