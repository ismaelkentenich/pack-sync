import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  RouteProp,
  useRoute,
} from "@react-navigation/native";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { RootStackParamList } from "@app/navigation/types";
import { Badge } from "@components/primitives/Badge";
import { Button } from "@components/primitives/Button";
import { Card } from "@components/primitives/Card";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { UpdateStatusModal } from "@features/packages/components/UpdateStatusModal";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import {
  translateDeliveryStatus,
  translatePackageStatus,
} from "@features/packages/utils/packageTranslations";
import { formatDate } from "@utils/date";
import { styles } from "./styles";

type PackageDetailsRouteProp = RouteProp<
  RootStackParamList,
  "PackageDetails"
>;

export default function PackageDetailsScreen() {
  const { t, i18n } = useTranslation();

  const userId = useAuthStore((state) => state.user?.id);

  const updateStatusModalRef =
    useRef<BottomSheetModal>(null);

  const { params } = useRoute<PackageDetailsRouteProp>();

  const { pkg } = params;

  const currentPackage = usePackageStore((state) =>
    state.packages.find((item) => item.id === pkg.id),
  );

  const packageData = currentPackage ?? pkg;

  const locale = i18n.resolvedLanguage ?? i18n.language;

  return (
    <ScreenContainer
      headerTitle={t("packages.details.title")}
      withGradientBackground
    >
      <View style={styles.container}>
        <Card
          style={styles.cardContainer}
          touchable={false}
        >
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>
              {t("packages.code")}: {packageData.code}
            </Text>

            <Button
              title={t("packages.details.changeStatus")}
              onPress={() =>
                updateStatusModalRef.current?.present()
              }
              variant="outline"
              style={styles.button}
            />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              {t("common.status")}:
            </Text>

            <Badge
              label={translatePackageStatus(
                packageData.status,
                t,
              )}
              variant="status"
            />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              {t("common.delivery")}:
            </Text>

            <Badge
              label={translateDeliveryStatus(
                packageData.deliveryStatus,
                t,
              )}
              variant="delivery"
            />
          </View>

          {packageData.status === PackageStatus.ENTREGUE &&
          packageData.receiverName ? (
            <Text style={styles.detailText}>
              {t("packages.details.receiver")}:{" "}
              {packageData.receiverName}
            </Text>
          ) : null}

          <Text style={styles.detailText}>
            {t("packages.scannedAt")}:{" "}
            {formatDate(packageData.scanned_at, locale)}
          </Text>
        </Card>
      </View>

      {userId ? (
        <UpdateStatusModal
          ref={updateStatusModalRef}
          handleCloseModal={() =>
            updateStatusModalRef.current?.close()
          }
          packageData={packageData}
          userId={userId}
        />
      ) : null}
    </ScreenContainer>
  );
}
