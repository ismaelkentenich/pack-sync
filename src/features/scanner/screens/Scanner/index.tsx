import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import React, {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Routes } from "@app/navigation/routes";
import { Button } from "@components/primitives/Button";
import ScreenContainer from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import PackageCard from "@features/packages/components/PackageCard";
import UpdateAllPackagesModal from "@features/packages/components/UpdateAllPackagesModal";
import { Package } from "@features/packages/domain/package.types";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translatePackageFeedback } from "@features/packages/utils/getPackageErrorFeedback";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { useShowAlert } from "@store/useAlertStore";
import Theme from "@theme/theme";
import { styles } from "./styles";

export default function ScanScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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

  const renderItem = useCallback(
    ({ item }: { item: Package }) => (
      <PackageCard item={item} pressable={false} />
    ),
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
      <ScreenContainer headerTitle={t("scanner.title")}>
        <View style={styles.noPermissionContainer}>
          <Text style={styles.noPermissionTitle}>
            {t("scanner.requestingPermission")}
          </Text>

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
      <ScreenContainer headerTitle={t("scanner.title")}>
        <View style={styles.noPermissionContainer}>
          <Text style={styles.noPermissionTitle}>
            {t("scanner.permissionRequired")}
          </Text>

          <View style={styles.noPermissionButton}>
            <Button
              title={t("scanner.grantPermission")}
              onPress={requestPermission}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer headerTitle={t("scanner.title")}>
      <View style={styles.container}>
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "code128"],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        </View>

        {currentSessionPackages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {t("scanner.empty")}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.infoHeader}>
              <TouchableOpacity
                onPress={openUpdateAllModal}
                style={styles.infoHeaderItem}
                disabled={isSyncingSession}
              >
                <Text style={styles.infoTouchableText}>
                  {t("packages.actions.updateAll")}
                </Text>
              </TouchableOpacity>

              <View style={styles.infoHeaderItem}>
                <Button
                  title={t("packages.actions.syncPackages")}
                  loading={isSyncingSession}
                  disabled={isSyncingSession}
                  onPress={() => {
                    if (!userId) {
                      return;
                    }

                    sendAllCurrentSessionPackages(userId);
                  }}
                />
              </View>
            </View>

            <View style={styles.infoWrapper}>
              <FlatList
                data={currentSessionPackages}
                keyExtractor={(item) =>
                  String(item.id ?? item.code)
                }
                contentContainerStyle={[
                  styles.flatlistContainer,
                  {
                    paddingBottom:
                      insets.bottom + Theme.spacing.xxxxxl,
                  },
                ]}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
              />

              <View
                style={[
                  styles.buttonContainer,
                  {
                    marginBottom: insets.bottom,
                  },
                ]}
              >
                <Button
                  title={t("packages.actions.viewAll")}
                  onPress={() =>
                    navigation.navigate("PackagesList")
                  }
                />
              </View>
            </View>
          </>
        )}

        <LinearGradient
          colors={[
            "transparent",
            Theme.colors.primary[200],
          ]}
          style={styles.background}
        />
      </View>

      {userId ? (
        <UpdateAllPackagesModal
          ref={updateAllModalRef}
          handleCloseModal={closeUpdateAllModal}
          onSuccessNavigate={() =>
            navigation.navigate("PackagesList")
          }
          userId={userId}
        />
      ) : null}
    </ScreenContainer>
  );
}
