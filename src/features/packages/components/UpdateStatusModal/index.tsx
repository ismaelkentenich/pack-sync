import Button from "@components/Button";
import Card from "@components/Card";
import { ModalCloseIcon, ModalWrapper } from "@components/ModalWrapper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { PackageStatus } from "@services/database/packages/enums";
import { Package } from "@services/database/packages/packages";
import { usePackageStore } from "@store/packages/usePackageStore";
import Theme from "@theme/theme";
import React, { forwardRef, Ref, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

interface UpdateStatusModalProps {
  handleCloseModal: () => void;
  packageData: Package;
}

export default forwardRef(function UpdateStatusModal(
  { handleCloseModal, packageData }: UpdateStatusModalProps,
  ref: Ref<BottomSheetModal>,
) {
  const insets = useSafeAreaInsets();
  const { changeStatus, loadPackages, sendPackage } = usePackageStore();

  const [selectedStatus, setSelectedStatus] = useState<PackageStatus>(packageData.status);

  const handleUpdate = () => {
    changeStatus(packageData.id!, selectedStatus);
    loadPackages();
    handleCloseModal();
  };

  const handleSendWebhook = async () => {
    try {
      changeStatus(packageData.id!, selectedStatus);
      await sendPackage({
        ...packageData,
        status: selectedStatus,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalWrapper ref={ref} snapPoints={["50%"]} style={styles.wrapper}>
      <ModalCloseIcon onPress={handleCloseModal} />
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Text style={styles.title}>Alteração de status </Text>

        <Text style={styles.text}>Selecione o novo status do pacote:</Text>
        <Card touchable={false}>
          <Text style={styles.text}>Pacote: {packageData.code}</Text>
        </Card>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
            style={styles.pickerContainer}
            dropdownIconColor={Theme.colors.neutral[300]}
            itemStyle={styles.pickerItem}
            mode="dropdown"
          >
            {Object.values(PackageStatus).map((status) => (
              <Picker.Item key={status} label={status} value={status} style={styles.pickerLabel} />
            ))}
          </Picker>
        </View>
        <Button title="Atualizar" onPress={handleUpdate} />
        <Button title="Enviar para Webhook" onPress={handleSendWebhook} variant="outline" />
      </View>
    </ModalWrapper>
  );
});
