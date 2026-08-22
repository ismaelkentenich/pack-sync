import Badge from "@components/primitives/Badge";
import Button from "@components/primitives/Button";
import Card from "@components/primitives/Card";
import { Package } from "@features/packages/domain/package.types";
import {
  translateDeliveryStatus,
  translatePackageStatus,
} from "@features/packages/utils/packageTranslations";
import { formatDate } from "@utils/date";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { styles } from "./styles";

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
  const { t, i18n } = useTranslation();

  const locale = i18n.resolvedLanguage ?? i18n.language;

  return (
    <Card
      style={styles.card}
      onPress={!showButtons ? onPress : undefined}
      touchable={pressable}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.codeText}>
          {t("packages.code")}: {item.code}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.text}>
            {t("packages.packageStatus")}:
          </Text>

          <Badge
            label={translatePackageStatus(item.status, t)}
            variant="status"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.text}>
            {t("packages.deliveryStatusLabel")}:
          </Text>

          <Badge
            label={translateDeliveryStatus(
              item.deliveryStatus,
              t,
            )}
            variant="delivery"
          />
        </View>

        <Text style={styles.text}>
          {t("packages.scannedAt")}:{" "}
          {formatDate(item.scanned_at, locale)}
        </Text>
      </View>

      {showButtons ? (
        <View style={styles.buttonContainer}>
          <Button
            title={t("packages.actions.viewDetails")}
            onPress={onPress}
            style={styles.buttonItem}
            size="sm"
          />

          <Button
            title={t("packages.actions.changeStatus")}
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
