import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import Card from "@components/primitives/Card";
import { Package } from "@features/packages/domain/package.types";
import Button from "@components/primitives/Button";
import Badge from "@components/primitives/Badge";
import { formatDate } from "@utils/date";

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
    <Card
      style={styles.card}
      onPress={!showButtons ? onPress : undefined}
      touchable={pressable}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.codeText}>
          Código: {item.code}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.text}>Status do pacote:</Text>
          <Badge label={item.status} variant="status" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.text}>Status do envio:</Text>
          <Badge
            label={item.deliveryStatus}
            variant="delivery"
          />
        </View>
        <Text style={styles.text}>
          Escaneado: {formatDate(item.scanned_at)}
        </Text>
      </View>
      {showButtons ? (
        <View style={styles.buttonContainer}>
          <Button
            title="Ver detalhes"
            onPress={onPress}
            style={styles.buttonItem}
            size="sm"
          />
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
