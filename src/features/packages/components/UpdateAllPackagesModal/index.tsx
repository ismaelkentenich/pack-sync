import Button from "@components/Button";
import Input from "@components/Input";
import { ModalCloseIcon, ModalWrapper } from "@components/ModalWrapper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { PackageStatus } from "@services/database/packages/enums";
import { usePackageStore } from "@store/packages/usePackageStore";
import Theme from "@theme/theme";
import React, { forwardRef, Ref, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

interface UpdateAllPackagesModalProps {
  handleCloseModal: () => void;
  onSuccessNavigate?: () => void;
}

export default forwardRef(function UpdateAllPackagesModal(
  { handleCloseModal, onSuccessNavigate }: UpdateAllPackagesModalProps,
  ref: Ref<BottomSheetModal>,
) {
  const insets = useSafeAreaInsets();
  const { currentSessionPackages, changeStatus, sendPackage, resetSession, loadPackages } =
    usePackageStore();

  const [selectedStatus, setSelectedStatus] = useState<PackageStatus>(PackageStatus.COLETADO);
  const [receiverName, setReceiverName] = useState("");

  const handleApplyToAll = async () => {
    if (currentSessionPackages.length === 0) {
      Alert.alert("Aviso", "Nenhum pacote bipado nesta sessão.");
      return;
    }

    if (selectedStatus === PackageStatus.ENTREGUE && !receiverName.trim()) {
      Alert.alert("Campo obrigatório", "Informe o nome do recebedor.");
      return;
    }

    try {
      for (const pkg of currentSessionPackages) {
        changeStatus(pkg.id!, selectedStatus);
        await sendPackage({
          ...pkg,
          status: selectedStatus,
        });
      }

      resetSession();
      loadPackages();
      handleCloseModal();
      Alert.alert("Sucesso", "Status atualizado e pacotes enviados ao webhook!", [
        {
          text: "OK",
          onPress: onSuccessNavigate,
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao atualizar os pacotes.");
    }
  };

  return (
    <ModalWrapper ref={ref} snapPoints={["60%"]} style={styles.wrapper} hasInputInsideModal>
      <ModalCloseIcon onPress={handleCloseModal} />
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Text style={styles.title}>Alterar status de todos os pacotes</Text>
        <Text style={styles.text}>
          Pacotes bipados nesta sessão: {currentSessionPackages.length}
        </Text>

        <View style={styles.innerContainer}>
          <Text style={styles.text}>Selecione o novo status:</Text>
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
                <Picker.Item
                  key={status}
                  label={status}
                  value={status}
                  style={styles.pickerLabel}
                />
              ))}
            </Picker>
          </View>
        </View>
        {selectedStatus === PackageStatus.ENTREGUE && (
          <View style={styles.innerContainer}>
            <Text style={styles.text}>Nome do recebedor:</Text>
            <Input
              placeholder="Ex: João da Silva"
              value={receiverName}
              onChangeText={setReceiverName}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Aplicar e Enviar ao Webhook" onPress={handleApplyToAll} />
        </View>
      </View>
    </ModalWrapper>
  );
});
