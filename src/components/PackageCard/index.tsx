import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import Card from "@components/Card";
import { Package } from "@services/database/packages/packages";
import Button from "@components/Button";
import Badge from "@components/Badge";

type PackageCards = {
  item: Package;
  onPress?: () => void;
  showButtons?: boolean;
  onPressUpdate?: () => void;
  pressable?: boolean;
};

export default function PackageCard({
  item,
  onPress,
  showButtons,
  onPressUpdate,
  pressable = true,
}: PackageCards) {
  return (
    <Card style={styles.card} onPress={!showButtons ? onPress : undefined} touchable={pressable}>
      <View style={styles.infoContainer}>
        <Text style={styles.codeText}>Código: {item.code}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.text}>Status do pacote:</Text>
          <Badge label={item.status} variant="status" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.text}>Status do envio:</Text>
          <Badge label={item.deliveryStatus} variant="delivery" />
        </View>
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
