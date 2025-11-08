import ScreenContainer from "@components/ScreenContainer";
import React, { useRef } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@app/navigation/types";
import Button from "@components/Button";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import UpdateStatusModal from "@features/packages/components/UpdateStatusModal";
import { usePackageStore } from "@store/packages/usePackageStore";

type PackageDetailsRouteProp = RouteProp<RootStackParamList, "PackageDetails">;

export default function PackageDetailsScreen() {
  const updateStatusModalRef = useRef<BottomSheetModal>(null);
  const { params } = useRoute<PackageDetailsRouteProp>();
  const { pkg } = params;

  const currentPackage = usePackageStore((state) => state.packages.find((p) => p.id === pkg.id));

  const packageData = currentPackage || pkg;

  return (
    <ScreenContainer headerTitle="Detalhes do Pacote">
      <View style={styles.container}>
        <Text style={styles.detailText}>Código: {packageData.code}</Text>
        <Text style={styles.detailText}>Status: {packageData.status}</Text>
        <Button title="Alterar status" onPress={() => updateStatusModalRef.current?.present()} />
        <Text style={styles.detailText}>Delivery: {packageData.deliveryStatus}</Text>
        <Text style={styles.detailText}>Cliente: {packageData.clientCode}</Text>
        <Text style={styles.detailText}>
          Escaneado em: {new Date(packageData.scanned_at).toLocaleString()}
        </Text>
      </View>

      <UpdateStatusModal
        ref={updateStatusModalRef}
        handleCloseModal={() => updateStatusModalRef.current?.close()}
        packageId={packageData.id!}
        packageCode={pkg.code}
        currentStatus={packageData.status}
      />
    </ScreenContainer>
  );
}
