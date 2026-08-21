import Card from "@components/primitives/Card";
import ScreenContainer from "@components/primitives/ScreenContainer";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { styles } from "./styles";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import Input from "@components/primitives/Input";
import Theme from "@theme/theme";
import { useAppNavigation } from "@hooks/useAppNavigation";
import PackageCard from "@features/packages/components/PackageCard/PackageCard";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Package } from "@services/database/packages/packages";
import UpdateStatusModal from "@features/packages/components/UpdateStatusModal";
import { Picker } from "@react-native-picker/picker";
import { PackageStatus } from "@services/database/packages/enums";

export default function PackagesListScreen() {
  const navigation = useAppNavigation("PackagesList");
  const updateStatusModalRef =
    useRef<BottomSheetModal>(null);
  const {
    packages,
    searchTerm,
    setSearchTerm,
    filteredPackages,
    loadPackages,
    statusFilter,
    setStatusFilter,
  } = usePackageStore();
  const [refreshing, setRefreshing] = useState(false);
  const filteredData = useMemo(
    () => filteredPackages(),
    [packages, searchTerm, statusFilter],
  );

  const [selectedPackage, setSelectedPackage] =
    useState<Package | null>(null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPackages();
    setRefreshing(false);
  }, [loadPackages]);

  useEffect(() => {
    loadPackages();
  }, []);

  const handleOpenUpdateModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    updateStatusModalRef.current?.present();
  };

  const renderItem = useCallback(
    ({ item }: { item: Package }) => (
      <PackageCard
        item={item}
        onPress={() =>
          navigation.navigate("PackageDetails", {
            pkg: item,
          })
        }
        onPressUpdate={() => handleOpenUpdateModal(item)}
        showButtons={false}
      />
    ),
    [navigation, handleOpenUpdateModal],
  );

  const keyExtractor = useCallback(
    (item: Package) => String(item.id ?? item.code),
    [],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <Input
          placeholder="Buscar por código..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={setStatusFilter}
            style={styles.pickerContainer}
            dropdownIconColor={Theme.colors.neutral[300]}
            mode="dropdown"
          >
            <Picker.Item
              label="Todos"
              value=""
              style={styles.pickerLabel}
            />
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
    ),
    [
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
    ],
  );

  return (
    <ScreenContainer
      headerTitle="Lista de Pacotes"
      withGradientBackground
    >
      <View style={styles.container}>
        {packages.length === 0 ? (
          <View style={styles.emptyScreenContainer}>
            <Text style={styles.emptyScreenText}>
              Nenhum pacote encontrado
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            contentContainerStyle={styles.flatlistContainer}
            ListHeaderComponent={ListHeaderComponent}
            keyExtractor={keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Theme.colors.primary[500]]}
              />
            }
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
          />
        )}
      </View>

      {selectedPackage && (
        <UpdateStatusModal
          ref={updateStatusModalRef}
          handleCloseModal={() =>
            updateStatusModalRef.current?.close()
          }
          packageData={selectedPackage}
        />
      )}
    </ScreenContainer>
  );
}
