import { Trash2 } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { Badge } from "@components/primitives/Badge";
import { Button } from "@components/primitives/Button";
import { Card } from "@components/primitives/Card";
import {
  translateDeliveryStatus,
  translatePackageStatus,
} from "@features/packages/utils/packageTranslations";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { formatDate } from "@utils/date";
import { styles } from "./styles";
import type { PackageCardProps } from "./types";

export function PackageCard({
  item,
  onPress,
  showButtons = false,
  onPressUpdate,
  showRemoveButton = false,
  onPressRemove,
  pressable = true,
  testID,
}: PackageCardProps) {
  const { t, i18n } = useTranslation();

  const locale = i18n?.resolvedLanguage ?? i18n?.language;

  return (
    <Card
      testID={testID ?? "packageCardRoot"}
      style={styles.card}
      onPress={!showButtons ? onPress : undefined}
      touchable={pressable}
    >
      <View
        testID="packageCardInfo"
        style={styles.infoContainer}
      >
        <Text
          testID="packageCardCode"
          style={styles.codeText}
        >
          {t("packages.code")}: {item.code}
        </Text>

        <View
          testID="packageCardStatusRow"
          style={styles.infoRow}
        >
          <Text
            testID="packageCardStatusLabel"
            style={styles.text}
          >
            {t("packages.packageStatus")}:
          </Text>

          <Badge
            testID="packageCardStatusBadge"
            label={translatePackageStatus(item.status, t)}
            variant="primary"
            size="sm"
          />
        </View>

        <View
          testID="packageCardDeliveryRow"
          style={styles.infoRow}
        >
          <Text
            testID="packageCardDeliveryLabel"
            style={styles.text}
          >
            {t("packages.deliveryStatusLabel")}:
          </Text>

          <Badge
            testID="packageCardDeliveryBadge"
            label={translateDeliveryStatus(
              item.deliveryStatus,
              t,
            )}
            variant="secondary"
            size="sm"
          />
        </View>

        <Text
          testID="packageCardScannedAt"
          style={styles.text}
        >
          {t("packages.scannedAt")}:{" "}
          {formatDate(item.scanned_at, locale)}
        </Text>
      </View>

      {showRemoveButton && onPressRemove ? (
        <TouchableOpacity
          testID="packageCardRemoveButton"
          accessibilityRole="button"
          accessibilityLabel={t(
            "packages.actions.removeFromSession",
          )}
          onPress={onPressRemove}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          style={styles.removeButton}
          activeOpacity={0.7}
        >
          <Trash2
            size={moderateScale(18)}
            color={Theme.colors.error[500]}
          />
        </TouchableOpacity>
      ) : null}

      {showButtons ? (
        <View
          testID="packageCardActions"
          style={styles.buttonContainer}
        >
          <Button
            testID="packageCardDetailsButton"
            title={t("packages.actions.viewDetails")}
            onPress={onPress}
            style={styles.buttonItem}
            size="sm"
          />

          <Button
            testID="packageCardUpdateButton"
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
