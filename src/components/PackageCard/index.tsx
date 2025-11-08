import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import Card from "@components/Card";
import { Package } from "@services/database/packages/packages";

type PackageCards = {
  item: Package;
  onPress?: () => void;
};

export default function PackageCard({ item, onPress }: PackageCards) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Código: {item.code}</Text>
        <Text style={styles.text}>Status do pacote: {item.status}</Text>
        <Text style={styles.text}>Status do envio: {item.deliveryStatus}</Text>
        <Text style={styles.text}>Escaneado em: {new Date(item.scanned_at).toLocaleString()}</Text>
      </View>
    </Card>
  );
}
