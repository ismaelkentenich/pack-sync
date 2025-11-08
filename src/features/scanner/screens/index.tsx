import { Routes } from "@app/navigation/routes";
import Button from "@components/Button";
import PackageCard from "@components/PackageCard";
import ScreenContainer from "@components/ScreenContainer";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { usePackageStore } from "@store/packages/usePackageStore";
import Theme from "@theme/theme";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import UpdateAllPackagesModal from "@features/packages/components/UpdateAllPackagesModal";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation(Routes.Scan);
  const updateAllModalRef = useRef<BottomSheetModal>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { currentSessionPackages, scanPackage, loadPackages } = usePackageStore();

  const scannedCodesRef = useRef<Set<string>>(new Set());

  const openUpdateAllModal = () => updateAllModalRef.current?.present();
  const closeUpdateAllModal = () => updateAllModalRef.current?.close();

  useEffect(() => {
    loadPackages();
  }, []);

  if (!permission) {
    return (
      <ScreenContainer>
        <View style={styles.noPermissionContainer}>
          <Text style={styles.noPermissionTitle}>Solicitando permissão de câmera...</Text>
          <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View style={styles.noPermissionContainer}>
          <Text style={styles.noPermissionTitle}>
            Para escanear os pacotes, ative a permissão da câmera.
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Conceder permissão" onPress={requestPermission} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    const data = result.data.trim();
    if (scannedCodesRef.current.has(data)) return;
    scannedCodesRef.current.add(data);
    scanPackage(data);
  };

  return (
    <ScreenContainer headerTitle="Scanner">
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
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

        <View style={styles.infoHeader}>
          <Text style={styles.infoText}>Pacotes bipados</Text>
          <TouchableOpacity onPress={openUpdateAllModal}>
            <Text style={styles.infoTouchableText}>Atualizar todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoWrapper}>
          <FlatList
            data={currentSessionPackages}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.flatlistContainer}
            renderItem={({ item }) => <PackageCard item={item} pressable={false} />}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Ver todos os pacotes"
              onPress={() => {
                navigation.navigate("PackagesList");
              }}
            />
          </View>
        </View>
      </View>
      <UpdateAllPackagesModal
        ref={updateAllModalRef}
        handleCloseModal={closeUpdateAllModal}
        onSuccessNavigate={() => navigation.navigate("PackagesList")}
      />
    </ScreenContainer>
  );
}
