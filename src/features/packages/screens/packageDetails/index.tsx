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
import Card from "@components/Card";
import Badge from "@components/Badge";
import { PackageStatus } from "@services/database/packages/enums";
import { formatDate } from "@utils/date";

type PackageDetailsRouteProp = RouteProp<RootStackParamList, "PackageDetails">;

export default function PackageDetailsScreen() {
  const updateStatusModalRef = useRef<BottomSheetModal>(null);
  const { params } = useRoute<PackageDetailsRouteProp>();
  const { pkg } = params;

  const currentPackage = usePackageStore((state) => state.packages.find((p) => p.id === pkg.id));

  const packageData = currentPackage || pkg;

  return (
    <ScreenContainer headerTitle="Detalhes do Pacote" withGradientBackground>
      <View style={styles.container}>
        <Card style={styles.cardContainer} touchable={false}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>Código: {packageData.code}</Text>
            <Button
              title="Alterar status"
              onPress={() => updateStatusModalRef.current?.present()}
              variant="outline"
              style={styles.button}
            />
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>Status:</Text>
            <Badge label={packageData.status} variant="status" />
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>Delivery:</Text>
            <Badge label={packageData.deliveryStatus} variant="delivery" />
          </View>
          {packageData.status === PackageStatus.ENTREGUE && packageData.receiverName && (
            <Text style={styles.detailText}>Recebedor: {packageData.receiverName}</Text>
          )}

          <Text style={styles.detailText}>Escaneado: {formatDate(packageData.scanned_at)}</Text>
        </Card>
      </View>

      <UpdateStatusModal
        ref={updateStatusModalRef}
        handleCloseModal={() => updateStatusModalRef.current?.close()}
        packageData={packageData}
      />
    </ScreenContainer>
  );
}
