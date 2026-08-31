import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import {
  Package as PackageIcon,
  RefreshCw,
} from "lucide-react-native";
import React, {
  forwardRef,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import {
  ModalCloseIcon,
  ModalWrapper,
} from "@components/composites/ModalWrapper";
import { Badge } from "@components/primitives/Badge/Badge";
import { Button } from "@components/primitives/Button";
import { Card } from "@components/primitives/Card";
import { Input } from "@components/primitives/Input";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { usePackageOperations } from "@features/packages/hooks/usePackageOperations";
import { selectSyncingPackageIds } from "@features/packages/store/package.selectors";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translateDeliveryStatus } from "@features/packages/utils/packageTranslations";
import { translatePackageStatus } from "@features/packages/utils/packageTranslations";
import { useShowAlert } from "@store/useAlertStore";
import Theme from "@theme/theme";
import { styles } from "./styles";
import { buildUpdatedPackage } from "./utils/buildUpdatedPackage";
import type { UpdateStatusModalProps } from "./types";

const PACKAGE_STATUSES = [
  PackageStatus.COLLECTED,
  PackageStatus.IN_DELIVERY,
  PackageStatus.DELIVERED,
];

export const UpdateStatusModal = forwardRef<
  BottomSheetModal,
  UpdateStatusModalProps
>(function UpdateStatusModal(
  { handleCloseModal, packageData, userId },
  ref,
) {
  const { t } = useTranslation();

  const { changeStatus, loadPackages, sendPackage } =
    usePackageOperations();

  const syncingPackageIds = usePackageStore(
    selectSyncingPackageIds,
  );

  const showAlert = useShowAlert((state) => state.show);

  const [selectedStatus, setSelectedStatus] =
    useState<PackageStatus>(packageData.status);

  const [receiverName, setReceiverName] = useState(
    packageData.receiverName ?? "",
  );

  const isSyncing =
    packageData.id !== undefined &&
    syncingPackageIds.includes(packageData.id);

  const isDelivered =
    selectedStatus === PackageStatus.DELIVERED;

  const receiverValue = receiverName.trim();

  const translatedCurrentStatus = useMemo(
    () => translatePackageStatus(packageData.status, t),
    [packageData.status, t],
  );

  const translatedDeliveryStatus = useMemo(
    () =>
      translateDeliveryStatus(
        packageData.deliveryStatus,
        t,
      ),
    [packageData.deliveryStatus, t],
  );

  const validateReceiver = () => {
    if (!isDelivered || receiverValue) {
      return true;
    }

    showAlert(
      t("packages.updateStatus.receiverRequired"),
      "error",
    );

    return false;
  };

  const updatePackageStatus = () => {
    if (!validateReceiver()) {
      return null;
    }

    if (packageData.id === undefined) {
      return null;
    }

    const nextReceiverName = isDelivered
      ? receiverValue
      : undefined;

    const result = changeStatus(
      packageData.id,
      userId,
      selectedStatus,
      nextReceiverName,
    );

    if (!result.success) {
      return null;
    }

    return buildUpdatedPackage({
      packageData,
      status: selectedStatus,
      receiverName: nextReceiverName,
    });
  };

  const handleUpdate = () => {
    if (isSyncing) {
      return;
    }

    const updatedPackage = updatePackageStatus();

    if (!updatedPackage) {
      return;
    }

    loadPackages(userId);

    handleCloseModal();
  };

  const handleUpdateAndSync = async () => {
    if (isSyncing) {
      return;
    }

    const updatedPackage = updatePackageStatus();

    if (!updatedPackage) {
      return;
    }

    loadPackages(userId);

    const syncResult = await sendPackage(
      updatedPackage,
      userId,
    );

    if (!syncResult.success) {
      return;
    }

    loadPackages(userId);

    handleCloseModal();
  };

  return (
    <ModalWrapper
      ref={ref}
      hasInputInsideModal={isDelivered}
      snapPoints={["72%", "88%", "95%"]}
    >
      <View
        testID="updateStatusModalContent"
        style={styles.container}
      >
        <View
          testID="updateStatusModalHeader"
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text
              testID="updateStatusModalTitle"
              accessibilityRole="header"
              style={styles.title}
            >
              {t("packages.updateStatus.title")}
            </Text>

            <Text
              testID="updateStatusModalSubtitle"
              style={styles.subtitle}
            >
              {packageData.code}
            </Text>
          </View>

          <ModalCloseIcon
            testID="updateStatusModalCloseButton"
            accessibilityLabel={t(
              "accessibility.modal.close",
            )}
            accessibilityRole="button"
            onPress={handleCloseModal}
          />
        </View>

        <Card
          testID="updateStatusModalPackageCard"
          touchable={false}
          style={styles.packageCard}
        >
          <View
            testID="updateStatusModalPackageIconContainer"
            style={styles.packageIconContainer}
          >
            <PackageIcon
              testID="updateStatusModalPackageIcon"
              size={Theme.sizing.icon.md}
              color={Theme.colors.primary[600]}
            />
          </View>

          <View style={styles.packageInfo}>
            <Text
              testID="updateStatusModalPackageLabel"
              style={styles.packageLabel}
            >
              {t("packages.code")}
            </Text>

            <Text
              testID="updateStatusModalPackageCode"
              style={styles.packageCode}
              numberOfLines={1}
            >
              {packageData.code}
            </Text>
          </View>
        </Card>

        <View
          testID="updateStatusModalCurrentState"
          style={styles.currentStateContainer}
        >
          <View style={styles.stateItem}>
            <Text
              testID="updateStatusModalDeliveryStatusLabel"
              style={styles.stateLabel}
            >
              {t("packages.deliveryStatusLabel")}
            </Text>

            <Badge
              testID="updateStatusModalDeliveryStatus"
              label={translatedDeliveryStatus}
              variant="secondary"
              labelTestID="updateStatusModalDeliveryStatusText"
            />
          </View>

          <View style={styles.stateItem}>
            <Text
              testID="updateStatusModalCurrentStatusLabel"
              style={styles.stateLabel}
            >
              {t("packages.packageStatus")}
            </Text>

            <Badge
              testID="updateStatusModalCurrentStatus"
              label={translatedCurrentStatus}
              variant="primary"
              labelTestID="updateStatusModalCurrentStatusText"
            />
          </View>
        </View>

        <View
          testID="updateStatusModalForm"
          style={styles.form}
        >
          <View
            testID="updateStatusModalStatusField"
            style={styles.field}
          >
            <Text
              testID="updateStatusModalStatusLabel"
              style={styles.fieldLabel}
            >
              {t("packages.updateStatus.selectStatus")}
            </Text>

            <View
              testID="updateStatusModalPickerWrapper"
              style={styles.pickerWrapper}
            >
              <Picker
                testID="updateStatusModalPicker"
                selectedValue={selectedStatus}
                enabled={!isSyncing}
                onValueChange={(value) => {
                  setSelectedStatus(value as PackageStatus);
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {PACKAGE_STATUSES.map((status) => (
                  <Picker.Item
                    key={status}
                    label={translatePackageStatus(
                      status,
                      t,
                    )}
                    value={status}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {isDelivered ? (
            <View
              testID="updateStatusModalReceiverField"
              style={styles.field}
            >
              <Input
                testID="updateStatusModalReceiverInput"
                label={t(
                  "packages.updateStatus.receiverName",
                )}
                placeholder={t(
                  "packages.updateStatus.receiverPlaceholder",
                )}
                value={receiverName}
                onChangeText={setReceiverName}
                editable={!isSyncing}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
          ) : null}
        </View>

        {isSyncing ? (
          <View
            testID="updateStatusModalSyncingInfo"
            style={styles.syncingInfo}
          >
            <RefreshCw
              testID="updateStatusModalSyncingIcon"
              size={Theme.sizing.icon.sm}
              color={Theme.colors.primary[600]}
            />

            <Text
              testID="updateStatusModalSyncingText"
              style={styles.syncingText}
            >
              {t("common.sync")}
            </Text>
          </View>
        ) : null}

        <View
          testID="updateStatusModalActions"
          style={styles.actions}
        >
          <Button
            testID="updateStatusModalUpdateButton"
            title={t("common.update")}
            variant="brand"
            size="md"
            disabled={isSyncing}
            onPress={handleUpdate}
          />

          <Button
            testID="updateStatusModalSyncButton"
            title={t("packages.actions.updateAndSync")}
            variant="outline"
            size="md"
            loading={isSyncing}
            disabled={isSyncing}
            onPress={handleUpdateAndSync}
          />
        </View>
      </View>
    </ModalWrapper>
  );
});
