import React, { forwardRef, Ref, useState } from "react";
import { View, Text } from "react-native";
import { ModalCloseIcon, ModalWrapper } from "@components/ModalWrapper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { styles } from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PackageStatus } from "@services/database/packages/enums";
import { usePackageStore } from "@store/packages/usePackageStore";
import { Picker } from "@react-native-picker/picker";
import Button from "@components/Button";
import Theme from "@theme/theme";
import Card from "@components/Card";

interface UpdateStatusModalProps {
  handleCloseModal: () => void;
  packageId: number;
  currentStatus: PackageStatus;
  packageCode: string;
}

export default forwardRef(function UpdateStatusModal(
  { handleCloseModal, packageId, currentStatus, packageCode }: UpdateStatusModalProps,
  ref: Ref<BottomSheetModal>,
) {
  const insets = useSafeAreaInsets();
  const { changeStatus } = usePackageStore();

  const [selectedStatus, setSelectedStatus] = useState<PackageStatus>(currentStatus);

  const handleUpdate = () => {
    changeStatus(packageId, selectedStatus);
    handleCloseModal();
  };

  return (
    <ModalWrapper ref={ref} snapPoints={["50%"]} style={styles.wrapper}>
      <ModalCloseIcon onPress={handleCloseModal} />
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Text style={styles.title}>Alteração de status </Text>

        <Text style={styles.text}>Selecione o novo status do pacote:</Text>
        <Card touchable={false}>
          <Text style={styles.text}>Pacote: {packageCode}</Text>
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
      </View>
    </ModalWrapper>
  );
});
