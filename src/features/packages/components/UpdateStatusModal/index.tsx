import {
  ModalCloseIcon,
  ModalWrapper,
} from "@components/composites/ModalWrapper";
import Button from "@components/primitives/Button";
import Card from "@components/primitives/Card";
import Input from "@components/primitives/Input";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translatePackageStatus } from "@features/packages/utils/packageTranslations";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { useShowAlert } from "@store/useAlertStore";
import Theme from "@theme/theme";
import React, { forwardRef, Ref, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

interface UpdateStatusModalProps {
  handleCloseModal: () => void;
  packageData: Package;
  userId: string;
}

export default forwardRef(function UpdateStatusModal(
  {
    handleCloseModal,
    packageData,
    userId,
  }: UpdateStatusModalProps,
  ref: Ref<BottomSheetModal>,
) {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const { changeStatus, loadPackages, sendPackage } =
    usePackageStore();

  const showAlert = useShowAlert((state) => state.show);

  const [selectedStatus, setSelectedStatus] =
    useState<PackageStatus>(packageData.status);

  const [receiverName, setReceiverName] = useState("");

  const handleUpdate = () => {
    if (
      selectedStatus === PackageStatus.ENTREGUE &&
      !receiverName.trim()
    ) {
      showAlert(
        t("packages.updateStatus.receiverRequired"),
        "error",
      );
      return;
    }

    changeStatus(
      packageData.id!,
      userId,
      selectedStatus,
      selectedStatus === PackageStatus.ENTREGUE
        ? receiverName
        : undefined,
    );

    loadPackages(userId);

    handleCloseModal();
  };

  const handleSendWebhook = async () => {
    if (
      selectedStatus === PackageStatus.ENTREGUE &&
      !receiverName.trim()
    ) {
      showAlert(
        t("packages.updateStatus.receiverRequired"),
        "error",
      );
      return;
    }

    try {
      changeStatus(
        packageData.id!,
        userId,
        selectedStatus,
        selectedStatus === PackageStatus.ENTREGUE
          ? receiverName
          : undefined,
      );

      loadPackages(userId);

      await sendPackage(
        {
          ...packageData,
          status: selectedStatus,
        },
        userId,
        selectedStatus === PackageStatus.ENTREGUE
          ? receiverName
          : undefined,
      );
    } finally {
      handleCloseModal();
    }
  };

  return (
    <ModalWrapper
      ref={ref}
      style={styles.wrapper}
      hasInputInsideModal
    >
      <ModalCloseIcon onPress={handleCloseModal} />

      <View
        style={[
          styles.container,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Text style={styles.title}>
          {t("packages.updateStatus.title")}
        </Text>

        <Text style={styles.text}>
          {t("packages.updateStatus.selectStatus")}
        </Text>

        <Card touchable={false}>
          <Text style={styles.text}>
            {t("common.package")}: {packageData.code}
          </Text>
        </Card>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value)
            }
            style={styles.pickerContainer}
            dropdownIconColor={Theme.colors.neutral[300]}
            itemStyle={styles.pickerItem}
            mode="dropdown"
          >
            {Object.values(PackageStatus).map((status) => (
              <Picker.Item
                key={status}
                label={translatePackageStatus(status, t)}
                value={status}
                style={styles.pickerLabel}
              />
            ))}
          </Picker>
        </View>

        {selectedStatus === PackageStatus.ENTREGUE ? (
          <View>
            <Text style={styles.text}>
              {t("packages.updateStatus.receiverName")}
            </Text>

            <Input
              placeholder={t(
                "packages.updateStatus.receiverPlaceholder",
              )}
              value={receiverName}
              onChangeText={setReceiverName}
            />
          </View>
        ) : null}

        <View
          style={[
            styles.buttonContainer,
            {
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <Button
            title={t("common.update")}
            onPress={handleUpdate}
          />

          <Button
            title={t("common.sync")}
            onPress={handleSendWebhook}
            variant="outline"
          />
        </View>
      </View>
    </ModalWrapper>
  );
});
