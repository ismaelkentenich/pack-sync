import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import React, { forwardRef, Ref, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ModalCloseIcon,
  ModalWrapper,
} from "@components/composites/ModalWrapper";
import Button from "@components/primitives/Button";
import Input from "@components/primitives/Input";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translatePackageStatus } from "@features/packages/utils/packageTranslations";
import { useShowAlert } from "@store/useAlertStore";
import Theme from "@theme/theme";
import { styles } from "./styles";

interface UpdateAllPackagesModalProps {
  handleCloseModal: () => void;
  onSuccessNavigate?: () => void;
  userId: string;
}

export default forwardRef(function UpdateAllPackagesModal(
  {
    handleCloseModal,
    onSuccessNavigate,
    userId,
  }: UpdateAllPackagesModalProps,
  ref: Ref<BottomSheetModal>,
) {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const showAlert = useShowAlert((state) => state.show);
  const isSyncingSession = usePackageStore(
    (state) => state.isSyncingSession,
  );
  const currentSessionPackages = usePackageStore(
    (state) => state.currentSessionPackages,
  );
  const updateAndSendCurrentSessionPackages =
    usePackageStore(
      (state) => state.updateAndSendCurrentSessionPackages,
    );

  const [selectedStatus, setSelectedStatus] =
    useState<PackageStatus>(PackageStatus.COLETADO);
  const [receiverName, setReceiverName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isSubmitting || isSyncingSession;

  const handleApplyToAll = async () => {
    if (isBusy) {
      return;
    }

    if (currentSessionPackages.length === 0) {
      showAlert(
        t("packages.updateAll.emptySession"),
        "error",
      );
      return;
    }

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

    setIsSubmitting(true);

    try {
      const result =
        await updateAndSendCurrentSessionPackages(
          userId,
          selectedStatus,
          selectedStatus === PackageStatus.ENTREGUE
            ? receiverName.trim()
            : undefined,
        );

      if (!result.success) {
        showAlert(t("packages.updateAll.error"), "error");
        return;
      }

      handleCloseModal();
      showAlert(t("packages.updateAll.success"), "success");
      onSuccessNavigate?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      ref={ref}
      snapPoints={["60%"]}
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
          {t("packages.updateAll.title")}
        </Text>

        <Text style={styles.text}>
          {t("packages.updateAll.packagesInSession", {
            count: currentSessionPackages.length,
          })}
        </Text>

        <View style={styles.innerContainer}>
          <Text style={styles.text}>
            {t("packages.updateAll.selectStatus")}
          </Text>

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
              enabled={!isBusy}
            >
              {Object.values(PackageStatus).map(
                (status) => (
                  <Picker.Item
                    key={status}
                    label={translatePackageStatus(
                      status,
                      t,
                    )}
                    value={status}
                    style={styles.pickerLabel}
                  />
                ),
              )}
            </Picker>
          </View>
        </View>

        {selectedStatus === PackageStatus.ENTREGUE ? (
          <View style={styles.innerContainer}>
            <Text style={styles.text}>
              {t("packages.updateStatus.receiverName")}
            </Text>

            <Input
              placeholder={t(
                "packages.updateStatus.receiverPlaceholder",
              )}
              value={receiverName}
              onChangeText={setReceiverName}
              editable={!isBusy}
            />
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            title={t("packages.actions.updateAndSync")}
            onPress={() => {
              handleApplyToAll();
            }}
            loading={isBusy}
            disabled={isBusy}
          />
        </View>
      </View>
    </ModalWrapper>
  );
});
