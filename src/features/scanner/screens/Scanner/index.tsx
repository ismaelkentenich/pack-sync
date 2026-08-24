import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {
  CameraOff,
  PackageSearch,
  ScanLine,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Routes } from "@app/navigation/routes";
import { Button } from "@components/primitives/Button";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { PackageCard } from "@features/packages/components/PackageCard";
import UpdateAllPackagesModal from "@features/packages/components/UpdateAllPackagesModal";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translatePackageFeedback } from "@features/packages/utils/getPackageErrorFeedback";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { useShowAlert } from "@store/useAlertStore";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { styles } from "./styles";
import type { Package } from "@features/packages/domain/package.types";
import type { ListRenderItemInfo } from "@shopify/flash-list";

export default function ScanScreen() {
  const { t } = useTranslation();

  const navigation = useAppNavigation(Routes.Scan);

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

  const clearFeedback = usePackageStore(
    (state) => state.clearFeedback,
  );

  const sendAllCurrentSessionPackages = usePackageStore(
    (state) => state.sendAllCurrentSessionPackages,
  );

  const [permission, requestPermission] =
    useCameraPermissions();

  const sessionCount = currentSessionPackages.length;

  const hasPackages = sessionCount > 0;

  const openUpdateAllModal = useCallback(() => {
    updateAllModalRef.current?.present();
  }, []);

  const closeUpdateAllModal = useCallback(() => {
    updateAllModalRef.current?.close();
  }, []);

  const handleBarCodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (!userId) {
        return;
      }

      const data = result.data.trim();

      if (!data || scannedCodesRef.current.has(data)) {
        return;
      }

      scannedCodesRef.current.add(data);

      scanPackage(data, userId);
    },
    [scanPackage, userId],
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
    navigation.navigate(Routes.PackagesList);
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Package>) => (
      <View
        testID={`scannerSessionItem-${
          item.id ?? item.code
        }`}
        style={styles.cardWrapper}
      >
        <PackageCard item={item} pressable={false} />
      </View>
    ),
    [],
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
      showAlert(
        translatePackageFeedback(t, feedback.success),
        "success",
      );

      clearFeedback();

      return;
    }

    if (feedback.error) {
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
              {t("scanner.permissionRequired")}
            </Text>
          </View>

          <View style={styles.permissionButton}>
            <Button
              testID="scannerGrantPermissionButton"
              title={t("scanner.grantPermission")}
              onPress={requestPermission}
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
      backgroundColorVariant="neutral100"
      safeAreaEdges={["bottom"]}
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
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "ean13", "code128"],
              }}
              onBarcodeScanned={handleBarCodeScanned}
            />

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
            navigation.navigate(Routes.PackagesList)
          }
          userId={userId}
        />
      ) : null}
    </ScreenContainer>
  );
}
