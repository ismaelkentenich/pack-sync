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
import { usePackageOperations } from "@features/packages/hooks/usePackageOperations";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import {
  getPackageErrorFeedback,
  translatePackageFeedback,
} from "@features/packages/utils/getPackageErrorFeedback";
import { useMainTabNavigation } from "@hooks/useMainTabNavigation";
import { useShowAlert } from "@store/useAlertStore";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import type { Package } from "@features/packages/domain/package.types";
import type { ListRenderItemInfo } from "@shopify/flash-list";

const SAME_CODE_SUPPRESSION_MS = 1500;

export default function ScanScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const navigation = useMainTabNavigation();

  const updateAllModalRef = useRef<BottomSheetModal>(null);

  const scannedCodesRef = useRef<Set<string>>(new Set());
  const inFlightCodesRef = useRef<Set<string>>(new Set());
  const lastDetectedCodeRef = useRef<string | null>(null);
  const lastDetectedAtRef = useRef<number>(0);

  const userId = useAuthStore((state) => state.user?.id);

  const showAlert = useShowAlert((state) => state.show);

  const {
    scanPackage,
    loadPackages,
    removeFromSession,
    resetSession,
    sendAllCurrentSessionPackages,
  } = usePackageOperations();

  const isSyncingSession = usePackageStore(
    (state) => state.isSyncingSession,
  );

  const currentSessionPackages = usePackageStore(
    (state) => state.currentSessionPackages,
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
      Haptics.impactAsync(
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
        return;
      }

      const data = result.data.trim();

      if (!data) {
        return;
      }

      const now = Date.now();
      const isSameCode =
        lastDetectedCodeRef.current === data;
      const timeSinceLastDetection =
        now - lastDetectedAtRef.current;

      if (
        isSameCode &&
        timeSinceLastDetection < SAME_CODE_SUPPRESSION_MS
      ) {
        lastDetectedAtRef.current = now;
        return;
      }

      lastDetectedCodeRef.current = data;
      lastDetectedAtRef.current = now;

      if (inFlightCodesRef.current.has(data)) {
        return;
      }

      if (scannedCodesRef.current.has(data)) {
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
      inFlightCodesRef.current.add(data);

      try {
        await scanPackage(data, userId);

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );

        showAlert(
          translatePackageFeedback(t, {
            key: "packages.feedback.scannedSuccessfully",
            params: { code: data },
          }),
          "success",
        );
      } catch (error) {
        console.error("[Scanner] scanPackage failed", {
          code: data,
          error,
        });

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error,
        );

        showAlert(
          translatePackageFeedback(
            t,
            getPackageErrorFeedback(error),
          ),
          "error",
        );
      } finally {
        inFlightCodesRef.current.delete(data);
      }
    },
    [scanPackage, showAlert, t, userId],
  );

  const handleSyncSession = useCallback(async () => {
    if (!userId || isSyncingSession || !hasPackages) {
      return;
    }

    const result =
      await sendAllCurrentSessionPackages(userId);

    if (result && !result.success) {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error,
      );

      showAlert(
        translatePackageFeedback(
          t,
          result.error
            ? getPackageErrorFeedback(result.error)
            : {
                key: "packages.feedback.sendSomeFailed",
              },
        ),
        "error",
      );
    }
  }, [
    hasPackages,
    isSyncingSession,
    sendAllCurrentSessionPackages,
    showAlert,
    t,
    userId,
  ]);

  const handleViewAll = useCallback(() => {
    navigation.navigate(Routes.Packages);
  }, [navigation]);

  const handleRemoveFromSession = useCallback(
    (pkg: Package) => {
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );

      scannedCodesRef.current.delete(pkg.code);
      inFlightCodesRef.current.delete(pkg.code);

      if (lastDetectedCodeRef.current === pkg.code) {
        lastDetectedCodeRef.current = null;
        lastDetectedAtRef.current = 0;
      }

      removeFromSession(pkg.id ?? pkg.code);
    },
    [removeFromSession],
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

      scannedCodesRef.current.clear();
      inFlightCodesRef.current.clear();
      lastDetectedCodeRef.current = null;
      lastDetectedAtRef.current = 0;
    }, [resetSession]),
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
          <View
            style={[
              styles.permissionIconContainer,
              {
                backgroundColor:
                  theme.colors.surface.subtle,
              },
            ]}
          >
            <ScanLine
              size={moderateScale(Theme.sizing.icon.lg)}
              color={theme.colors.icon.brand}
            />
          </View>

          <View style={styles.permissionTextContainer}>
            <Text
              style={[
                styles.permissionTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {t("scanner.preparingCamera")}
            </Text>

            <Text
              style={[
                styles.permissionDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
              {t("scanner.requestingPermission")}
            </Text>
          </View>

          <ActivityIndicator
            size="large"
            color={theme.colors.icon.brand}
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
          <View
            style={[
              styles.permissionIconContainer,
              {
                backgroundColor:
                  theme.colors.surface.subtle,
              },
            ]}
          >
            <CameraOff
              size={moderateScale(Theme.sizing.icon.lg)}
              color={theme.colors.icon.brand}
            />
          </View>

          <View style={styles.permissionTextContainer}>
            <Text
              style={[
                styles.permissionTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {t("scanner.permissionTitle")}
            </Text>

            <Text
              style={[
                styles.permissionDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
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
                barcodeTypes: ["qr", "code128"],
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
            style={[
              styles.instructionContainer,
              {
                backgroundColor:
                  theme.colors.surface.subtle,
              },
            ]}
          >
            <View
              style={[
                styles.instructionIconContainer,
                {
                  backgroundColor:
                    theme.colors.surface.default,
                },
              ]}
            >
              <ScanLine
                size={moderateScale(Theme.sizing.icon.sm)}
                color={theme.colors.icon.brand}
              />
            </View>

            <View style={styles.instructionContent}>
              <Text
                style={[
                  styles.instructionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {t("scanner.instructionTitle")}
              </Text>

              <Text
                style={[
                  styles.instructionDescription,
                  { color: theme.colors.text.secondary },
                ]}
              >
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
                style={[
                  styles.sessionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {t("scanner.sessionTitle")}
              </Text>

              <Text
                testID="scannerSessionCount"
                style={[
                  styles.sessionCount,
                  { color: theme.colors.text.tertiary },
                ]}
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
                <Text
                  style={[
                    styles.updateAllText,
                    { color: theme.colors.text.brand },
                  ]}
                >
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
              <View
                style={[
                  styles.emptyIconContainer,
                  {
                    backgroundColor:
                      theme.colors.surface.subtle,
                  },
                ]}
              >
                <PackageSearch
                  size={moderateScale(Theme.sizing.icon.lg)}
                  color={theme.colors.icon.brand}
                />
              </View>

              <Text
                style={[
                  styles.emptyTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {t("scanner.emptyTitle")}
              </Text>

              <Text
                style={[
                  styles.emptyDescription,
                  { color: theme.colors.text.secondary },
                ]}
              >
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
