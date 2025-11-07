import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import { useCameraPermissions, CameraView, BarcodeScanningResult } from "expo-camera";
import ScreenContainer from "@components/ScreenContainer";
import { styles } from "./styles";
import { usePackageStore } from "@store/packages/usePackageStore";
import Button from "@components/Button";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { Routes } from "@app/navigation/routes";
import Card from "@components/Card";

export default function ScanScreen() {
  const navigation = useAppNavigation(Routes.Scan);
  const [permission, requestPermission] = useCameraPermissions();
  const { currentSessionPackages, scanPackage, loadPackages } = usePackageStore();

  const scannedCodesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadPackages();
  }, []);

  if (!permission) {
    return (
      <ScreenContainer>
        <Text>Solicitando permissão de câmera...</Text>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <Text>Permissão de câmera negada.</Text>
        <Text style={{ color: "blue", marginTop: 10 }} onPress={requestPermission}>
          Conceder permissão
        </Text>
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
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Scan</Text>

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

        <View style={styles.infoWrapper}>
          <FlatList
            data={currentSessionPackages}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.flatlistContainer}
            ListHeaderComponent={
              <View>
                <Text style={styles.infoText}>Pacotes bipados nesta sessão:</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Card style={styles.scannedItemContainer}>
                <Text style={styles.scannedItemText}>Código: {item.code}</Text>
                <Text style={styles.scannedItemText}>Status: {item.status}</Text>
                <Text style={styles.scannedItemText}>Delivery: {item.deliveryStatus}</Text>
                <Text style={styles.scannedItemText}>
                  Bipado em: {new Date(item.scanned_at).toLocaleString()}
                </Text>
              </Card>
            )}
          />
          <Button
            title="Ver todos os pacotes"
            onPress={() => {
              navigation.navigate("PackagesList");
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
