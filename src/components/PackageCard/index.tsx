import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import Card from "@components/Card";
import { Package } from "@services/database/packages/packages";
import Button from "@components/Button";

type PackageCards = {
  item: Package;
  onPress?: () => void;
  showButtons?: boolean;
  onPressUpdate?: () => void;
};

export default function PackageCard({ item, onPress, showButtons, onPressUpdate }: PackageCards) {
  return (
    <Card style={styles.card} onPress={!showButtons ? onPress : undefined}>
      <View style={styles.infoContainer}>
        <Text style={styles.codeText}>Código: {item.code}</Text>
        <Text style={styles.text}>Status do pacote: {item.status}</Text>
        <Text style={styles.text}>Status do envio: {item.deliveryStatus}</Text>
        <Text style={styles.text}>Escaneado em: {new Date(item.scanned_at).toLocaleString()}</Text>
      </View>
      {showButtons ? (
        <View style={styles.buttonContainer}>
          <Button title="Ver detalhes" onPress={onPress} style={styles.buttonItem} size="sm" />
          <Button
            title="Alterar status"
            onPress={onPressUpdate}
            style={styles.buttonItem}
            size="sm"
            variant="outline"
          />
        </View>
      ) : null}
    </Card>
  );
}
