import { Routes } from "@app/navigation/routes";
import Button from "@components/primitives/Button";
import PackageCard from "@features/packages/components/PackageCard/PackageCard";
import ScreenContainer from "@components/primitives/ScreenContainer";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import Theme from "@theme/theme";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import React, {
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import UpdateAllPackagesModal from "@features/packages/components/UpdateAllPackagesModal";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Package } from "@infrastructure/database/packages/packages";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation(Routes.Scan);
  const updateAllModalRef = useRef<BottomSheetModal>(null);

  const [permission, requestPermission] =
    useCameraPermissions();

  const {
    currentSessionPackages,
    scanPackage,
    loadPackages,
    resetSession,
    sendAllCurrentSessionPackages,
  } = usePackageStore();

  const scannedCodesRef = useRef<Set<string>>(new Set());

  const openUpdateAllModal = useCallback(() => {
    updateAllModalRef.current?.present();
  }, []);

  const closeUpdateAllModal = useCallback(() => {
    updateAllModalRef.current?.close();
  }, []);

  const handleBarCodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      const data = result.data.trim();

      if (!data || scannedCodesRef.current.has(data)) {
        return;
      }

      scannedCodesRef.current.add(data);
      scanPackage(data);
    },
    [scanPackage],
  );

  const renderItem = useCallback(
    ({ item }: { item: Package }) => (
      <PackageCard item={item} pressable={false} />
    ),
    [],
  );

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  useFocusEffect(
    useCallback(() => {
      resetSession();
      scannedCodesRef.current.clear();
    }, [resetSession]),
  );

  if (!permission) {
    return (
      <ScreenContainer>
        <View style={styles.noPermissionContainer}>
          <Text style={styles.noPermissionTitle}>
            Solicitando permissão de câmera...
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
      <ScreenContainer>
        <View style={styles.noPermissionContainer}>
          <Text style={styles.noPermissionTitle}>
            Para escanear os pacotes, ative a permissão da
            câmera.
          </Text>

          <View style={styles.noPermissionButton}>
            <Button
              title="Conceder permissão"
              onPress={requestPermission}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer headerTitle="Scanner">
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
              Nenhum pacote escaneado ainda
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.infoHeader}>
              <TouchableOpacity
                onPress={openUpdateAllModal}
                style={styles.infoHeaderItem}
              >
                <Text style={styles.infoTouchableText}>
                  Atualizar todos
                </Text>
              </TouchableOpacity>

              <View style={styles.infoHeaderItem}>
                <Button
                  title="Enviar para webhook"
                  onPress={sendAllCurrentSessionPackages}
                />
              </View>
            </View>

            <View style={styles.infoWrapper}>
              <FlatList
                data={currentSessionPackages}
                keyExtractor={(item) => item.code}
                contentContainerStyle={[
                  styles.flatlistContainer,
                  {
                    paddingBottom: insets.bottom + 64,
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
                  title="Ver todos os pacotes"
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

      <UpdateAllPackagesModal
        ref={updateAllModalRef}
        handleCloseModal={closeUpdateAllModal}
        onSuccessNavigate={() =>
          navigation.navigate("PackagesList")
        }
      />
    </ScreenContainer>
  );
}
