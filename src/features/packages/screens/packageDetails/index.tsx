import ScreenContainer from "@components/ScreenContainer";
import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@app/navigation/types";

type PackageDetailsRouteProp = RouteProp<RootStackParamList, "PackageDetails">;

export default function PackageDetailsScreen() {
  const { params } = useRoute<PackageDetailsRouteProp>();
  const { pkg } = params;

  return (
    <ScreenContainer headerTitle="Detalhes do Pacote">
      <View style={styles.container}>
        <Text style={styles.detailText}>Código: {pkg.code}</Text>
        <Text style={styles.detailText}>Status: {pkg.status}</Text>
        <Text style={styles.detailText}>Delivery: {pkg.deliveryStatus}</Text>
        <Text style={styles.detailText}>Cliente: {pkg.clientCode}</Text>
        <Text style={styles.detailText}>
          Escaneado em: {new Date(pkg.scanned_at).toLocaleString()}
        </Text>
      </View>
    </ScreenContainer>
  );
}
