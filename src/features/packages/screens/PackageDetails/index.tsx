import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import {
  CalendarDays,
  Package as PackageIcon,
  UserRound,
} from "lucide-react-native";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Badge } from "@components/primitives/Badge";
import { Button } from "@components/primitives/Button";
import { Card } from "@components/primitives/Card";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { UpdateStatusModal } from "@features/packages/components/UpdateStatusModal";
import { DeliveryStatus } from "@features/packages/domain/package.enums";
import { usePackageOperations } from "@features/packages/hooks/usePackageOperations";
import {
  selectPackageByCode,
  selectSyncingPackageIds,
} from "@features/packages/store/package.selectors";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import {
  translateDeliveryStatus,
  translatePackageStatus,
} from "@features/packages/utils/packageTranslations";
import Theme from "@theme/theme";
import { useAppTheme } from "@theme/useAppTheme";
import { formatDate } from "@utils/date";
import { styles } from "./styles";

export default function PackageDetailsScreen() {
  const { t, i18n } = useTranslation();
  const { theme } = useAppTheme();

  const userId = useAuthStore((state) => state.user?.id);

  const { sendPackage } = usePackageOperations();

  const updateStatusModalRef =
    useRef<BottomSheetModal>(null);

  const { code } = useLocalSearchParams<{ code: string }>();

  const currentPackage = usePackageStore(
    selectPackageByCode(code),
  );

  const syncingPackageIds = usePackageStore(
    selectSyncingPackageIds,
  );

  const handleOpenStatusModal = useCallback(() => {
    updateStatusModalRef.current?.present();
  }, []);

  const handleCloseStatusModal = useCallback(() => {
    updateStatusModalRef.current?.close();
  }, []);

  const isSyncingThis =
    currentPackage?.id !== undefined &&
    syncingPackageIds.includes(currentPackage.id);

  const handleSyncPackage = useCallback(async () => {
    if (!userId || !currentPackage || isSyncingThis) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    await sendPackage(currentPackage, userId);
  }, [currentPackage, isSyncingThis, sendPackage, userId]);

  if (!currentPackage) {
    return null;
  }

  const packageData = currentPackage;

  const locale = i18n.resolvedLanguage ?? i18n.language;

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
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    theme.colors.surface.subtle,
                },
              ]}
            >
              <PackageIcon
                testID="packageDetailsIcon"
                size={Theme.sizing.icon.md}
                color={theme.colors.icon.brand}
              />
            </View>

            <View style={styles.codeContent}>
              <Text
                testID="packageDetailsCode"
                accessibilityRole="header"
                numberOfLines={2}
                style={[
                  styles.code,
                  { color: theme.colors.text.primary },
                ]}
              >
                {packageData.code}
              </Text>

              <Text
                testID="packageDetailsDescription"
                style={[
                  styles.description,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {t("packages.details.description")}
              </Text>
            </View>
          </View>
        </View>

        <Card
          testID="packageDetailsStatusCard"
          touchable={false}
          style={[
            styles.statusCard,
            {
              backgroundColor: theme.colors.surface.default,
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          <View
            testID="packageDetailsStatusItem"
            style={styles.statusItem}
          >
            <Text
              style={[
                styles.statusLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
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

          <View
            style={[
              styles.statusDivider,
              {
                backgroundColor: theme.colors.border.subtle,
              },
            ]}
          />

          <View
            testID="packageDetailsDeliveryItem"
            style={styles.statusItem}
          >
            <Text
              style={[
                styles.statusLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
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
            style={[
              styles.sectionTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {t("packages.details.information")}
          </Text>

          <Card
            testID="packageDetailsInformationCard"
            touchable={false}
            style={[
              styles.informationCard,
              {
                backgroundColor:
                  theme.colors.surface.default,
                borderColor: theme.colors.border.subtle,
              },
            ]}
          >
            <View
              testID="packageDetailsCodeInfo"
              style={styles.informationRow}
            >
              <View
                style={[
                  styles.informationIconContainer,
                  {
                    backgroundColor:
                      theme.colors.surface.subtle,
                  },
                ]}
              >
                <PackageIcon
                  size={Theme.sizing.icon.sm}
                  color={theme.colors.icon.brand}
                />
              </View>

              <View style={styles.informationContent}>
                <Text
                  style={[
                    styles.informationLabel,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  {t("packages.details.code")}
                </Text>

                <Text
                  testID="packageDetailsCodeValue"
                  selectable
                  style={[
                    styles.informationValue,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {packageData.code}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.informationDivider,
                {
                  backgroundColor:
                    theme.colors.border.subtle,
                },
              ]}
            />

            <View
              testID="packageDetailsScannedAtInfo"
              style={styles.informationRow}
            >
              <View
                style={[
                  styles.informationIconContainer,
                  {
                    backgroundColor:
                      theme.colors.surface.subtle,
                  },
                ]}
              >
                <CalendarDays
                  size={Theme.sizing.icon.sm}
                  color={theme.colors.icon.brand}
                />
              </View>

              <View style={styles.informationContent}>
                <Text
                  style={[
                    styles.informationLabel,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  {t("packages.details.scannedAt")}
                </Text>

                <Text
                  testID="packageDetailsScannedAtValue"
                  style={[
                    styles.informationValue,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {formatDate(
                    packageData.scanned_at,
                    locale,
                  )}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.informationDivider,
                {
                  backgroundColor:
                    theme.colors.border.subtle,
                },
              ]}
            />

            <View
              testID="packageDetailsReceiverInfo"
              style={styles.informationRow}
            >
              <View
                style={[
                  styles.informationIconContainer,
                  {
                    backgroundColor:
                      theme.colors.surface.subtle,
                  },
                ]}
              >
                <UserRound
                  size={Theme.sizing.icon.sm}
                  color={theme.colors.icon.brand}
                />
              </View>

              <View style={styles.informationContent}>
                <Text
                  style={[
                    styles.informationLabel,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  {t("packages.details.receiver")}
                </Text>

                <Text
                  testID="packageDetailsReceiverValue"
                  style={[
                    styles.informationValue,
                    { color: theme.colors.text.primary },
                    !packageData.receiverName && [
                      styles.informationValueMuted,
                      { color: theme.colors.text.disabled },
                    ],
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
            style={[
              styles.sectionTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {t("packages.details.actions")}
          </Text>

          {packageData.deliveryStatus ===
          DeliveryStatus.PENDING ? (
            <Button
              testID="packageDetailsSyncButton"
              title={
                isSyncingThis
                  ? t("packages.details.syncing")
                  : t("packages.details.syncNow")
              }
              variant="outline"
              size="md"
              loading={isSyncingThis}
              disabled={isSyncingThis}
              onPress={handleSyncPackage}
            />
          ) : null}

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
