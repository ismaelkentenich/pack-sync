import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { Package } from "lucide-react-native";
import React, { forwardRef, Ref, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ModalCloseIcon,
  ModalWrapper,
} from "@components/composites/ModalWrapper/ModalWrapper";
import { Button } from "@components/primitives/Button";
import { Input } from "@components/primitives/Input";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { usePackageOperations } from "@features/packages/hooks/usePackageOperations";
import {
  selectCurrentSessionPackages,
  selectIsSyncingSession,
} from "@features/packages/store/package.selectors";
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

  const { updateAndSendCurrentSessionPackages } =
    usePackageOperations();

  const isSyncingSession = usePackageStore(
    selectIsSyncingSession,
  );

  const currentSessionPackages = usePackageStore(
    selectCurrentSessionPackages,
  );

  const [selectedStatus, setSelectedStatus] =
    useState<PackageStatus>(PackageStatus.COLLECTED);

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
      selectedStatus === PackageStatus.DELIVERED &&
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
          selectedStatus === PackageStatus.DELIVERED
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
      testID="updateAllPackagesModal"
      snapPoints={["68%", "88%"]}
      style={styles.wrapper}
      hasInputInsideModal
      isBlocked={isBusy}
    >
      <ModalCloseIcon
        testID="updateAllPackagesCloseButton"
        onPress={handleCloseModal}
        disabled={isBusy}
      />

      <View
        testID="updateAllPackagesContent"
        style={[
          styles.container,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View
          testID="updateAllPackagesHeader"
          style={styles.header}
        >
          <Text
            testID="updateAllPackagesTitle"
            style={styles.title}
            accessibilityRole="header"
          >
            {t("packages.updateAll.title")}
          </Text>

          <Text
            testID="updateAllPackagesDescription"
            style={styles.description}
          >
            {t("packages.updateAll.description")}
          </Text>
        </View>

        <View
          testID="updateAllPackagesSummary"
          style={styles.summary}
        >
          <View
            testID="updateAllPackagesSummaryIconContainer"
            style={styles.summaryIconContainer}
          >
            <Package
              testID="updateAllPackagesSummaryIcon"
              size={Theme.sizing.icon.md}
              color={Theme.colors.primary[700]}
            />
          </View>

          <View style={styles.summaryContent}>
            <Text
              testID="updateAllPackagesCount"
              style={styles.summaryValue}
            >
              {t("packages.updateAll.packagesInSession", {
                count: currentSessionPackages.length,
              })}
            </Text>

            <Text
              testID="updateAllPackagesSummaryDescription"
              style={styles.summaryDescription}
            >
              {t("packages.updateAll.summaryDescription")}
            </Text>
          </View>
        </View>

        <View
          testID="updateAllPackagesStatusField"
          style={styles.field}
        >
          <Text
            testID="updateAllPackagesStatusLabel"
            style={styles.label}
          >
            {t("packages.updateAll.selectStatus")}
          </Text>

          <View
            testID="updateAllPackagesPickerWrapper"
            style={styles.pickerWrapper}
          >
            <Picker
              testID="updateAllPackagesPicker"
              selectedValue={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value);

                if (value !== PackageStatus.DELIVERED) {
                  setReceiverName("");
                }
              }}
              style={styles.picker}
              dropdownIconColor={Theme.colors.neutral[600]}
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
                  />
                ),
              )}
            </Picker>
          </View>
        </View>

        {selectedStatus === PackageStatus.DELIVERED ? (
          <View
            testID="updateAllPackagesReceiverField"
            style={styles.field}
          >
            <Input
              testID="updateAllPackagesReceiverInput"
              label={t(
                "packages.updateStatus.receiverName",
              )}
              placeholder={t(
                "packages.updateStatus.receiverPlaceholder",
              )}
              value={receiverName}
              onChangeText={setReceiverName}
              editable={!isBusy}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
        ) : null}

        <View
          testID="updateAllPackagesActions"
          style={styles.actions}
        >
          <Button
            testID="updateAllPackagesSubmitButton"
            title={t("packages.actions.updateAndSync")}
            variant="brand"
            size="lg"
            onPress={handleApplyToAll}
            loading={isBusy}
            disabled={isBusy}
          />
        </View>
      </View>
    </ModalWrapper>
  );
});
