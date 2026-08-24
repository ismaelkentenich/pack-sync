import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  RouteProp,
  useRoute,
} from "@react-navigation/native";
import {
  CalendarDays,
  Package as PackageIcon,
  UserRound,
} from "lucide-react-native";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Routes } from "@app/config/routes";
import { Badge } from "@components/primitives/Badge";
import { Button } from "@components/primitives/Button";
import { Card } from "@components/primitives/Card";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { UpdateStatusModal } from "@features/packages/components/UpdateStatusModal";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import {
  translateDeliveryStatus,
  translatePackageStatus,
} from "@features/packages/utils/packageTranslations";
import Theme from "@theme/theme";
import { formatDate } from "@utils/date";
import { styles } from "./styles";
import type { PackagesStackParamList } from "@app/config/types";

type PackageDetailsRouteProp = RouteProp<
  PackagesStackParamList,
  typeof Routes.PackageDetails
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

  const handleOpenStatusModal = useCallback(() => {
    updateStatusModalRef.current?.present();
  }, []);

  const handleCloseStatusModal = useCallback(() => {
    updateStatusModalRef.current?.close();
  }, []);

  const receiverName =
    packageData.receiverName?.trim() ||
    t("packages.details.notAvailable");

  return (
    <ScreenContainer
      testID="packageDetailsScreen"
      headerTitle={t("packages.details.title")}
      headerVariant="neutral"
      backgroundColorVariant="neutral100"
      safeAreaEdges={["bottom"]}
      scrollable
      contentContainerStyle={styles.screenContent}
    >
      <View
        testID="packageDetailsContainer"
        style={styles.container}
      >
        <View
          testID="packageDetailsIntroduction"
          style={styles.introduction}
        >
          <View
            testID="packageDetailsCodeRow"
            style={styles.codeRow}
          >
            <View
              testID="packageDetailsIconContainer"
              style={styles.iconContainer}
            >
              <PackageIcon
                testID="packageDetailsIcon"
                size={Theme.sizing.icon.md}
                color={Theme.colors.primary[600]}
              />
            </View>

            <View style={styles.codeContent}>
              <Text
                testID="packageDetailsCode"
                accessibilityRole="header"
                numberOfLines={2}
                style={styles.code}
              >
                {packageData.code}
              </Text>

              <Text
                testID="packageDetailsDescription"
                style={styles.description}
              >
                {t("packages.details.description")}
              </Text>
            </View>
          </View>
        </View>

        <Card
          testID="packageDetailsStatusCard"
          touchable={false}
          style={styles.statusCard}
        >
          <View
            testID="packageDetailsStatusItem"
            style={styles.statusItem}
          >
            <Text style={styles.statusLabel}>
              {t("packages.details.currentStatus")}
            </Text>

            <Badge
              testID="packageDetailsStatusBadge"
              label={translatePackageStatus(
                packageData.status,
                t,
              )}
              variant="primary"
              size="sm"
            />
          </View>

          <View style={styles.statusDivider} />

          <View
            testID="packageDetailsDeliveryItem"
            style={styles.statusItem}
          >
            <Text style={styles.statusLabel}>
              {t("packages.details.synchronization")}
            </Text>

            <Badge
              testID="packageDetailsDeliveryBadge"
              label={translateDeliveryStatus(
                packageData.deliveryStatus,
                t,
              )}
              variant="secondary"
              size="sm"
            />
          </View>
        </Card>

        <View
          testID="packageDetailsInformationSection"
          style={styles.section}
        >
          <Text
            testID="packageDetailsInformationTitle"
            style={styles.sectionTitle}
          >
            {t("packages.details.information")}
          </Text>

          <Card
            testID="packageDetailsInformationCard"
            touchable={false}
            style={styles.informationCard}
          >
            <View
              testID="packageDetailsCodeInfo"
              style={styles.informationRow}
            >
              <View style={styles.informationIconContainer}>
                <PackageIcon
                  size={Theme.sizing.icon.sm}
                  color={Theme.colors.primary[600]}
                />
              </View>

              <View style={styles.informationContent}>
                <Text style={styles.informationLabel}>
                  {t("packages.details.code")}
                </Text>

                <Text
                  testID="packageDetailsCodeValue"
                  selectable
                  style={styles.informationValue}
                >
                  {packageData.code}
                </Text>
              </View>
            </View>

            <View style={styles.informationDivider} />

            <View
              testID="packageDetailsScannedAtInfo"
              style={styles.informationRow}
            >
              <View style={styles.informationIconContainer}>
                <CalendarDays
                  size={Theme.sizing.icon.sm}
                  color={Theme.colors.primary[600]}
                />
              </View>

              <View style={styles.informationContent}>
                <Text style={styles.informationLabel}>
                  {t("packages.details.scannedAt")}
                </Text>

                <Text
                  testID="packageDetailsScannedAtValue"
                  style={styles.informationValue}
                >
                  {formatDate(
                    packageData.scanned_at,
                    locale,
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.informationDivider} />

            <View
              testID="packageDetailsReceiverInfo"
              style={styles.informationRow}
            >
              <View style={styles.informationIconContainer}>
                <UserRound
                  size={Theme.sizing.icon.sm}
                  color={Theme.colors.primary[600]}
                />
              </View>

              <View style={styles.informationContent}>
                <Text style={styles.informationLabel}>
                  {t("packages.details.receiver")}
                </Text>

                <Text
                  testID="packageDetailsReceiverValue"
                  style={[
                    styles.informationValue,
                    !packageData.receiverName &&
                      styles.informationValueMuted,
                  ]}
                >
                  {receiverName}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View
          testID="packageDetailsActionsSection"
          style={styles.section}
        >
          <Text
            testID="packageDetailsActionsTitle"
            style={styles.sectionTitle}
          >
            {t("packages.details.actions")}
          </Text>

          <Button
            testID="packageDetailsChangeStatusButton"
            title={t("packages.details.changeStatus")}
            variant="brand"
            size="md"
            onPress={handleOpenStatusModal}
          />
        </View>
      </View>

      {userId ? (
        <UpdateStatusModal
          ref={updateStatusModalRef}
          handleCloseModal={handleCloseStatusModal}
          packageData={packageData}
          userId={userId}
        />
      ) : null}
    </ScreenContainer>
  );
}
