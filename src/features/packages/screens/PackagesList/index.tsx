import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Input } from "@components/primitives/Input";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { PackageCard } from "@features/packages/components/PackageCard";
import UpdateStatusModal from "@features/packages/components/UpdateStatusModal";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translatePackageStatus } from "@features/packages/utils/packageTranslations";
import { useAppNavigation } from "@hooks/useAppNavigation";
import Theme from "@theme/theme";
import { styles } from "./styles";

export default function PackagesListScreen() {
  const { t } = useTranslation();

  const navigation = useAppNavigation("PackagesList");

  const userId = useAuthStore((state) => state.user?.id);

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

  const [selectedPackage, setSelectedPackage] =
    useState<Package | null>(null);

  const filteredData = filteredPackages();

  const handleRefresh = useCallback(async () => {
    if (!userId) {
      return;
    }

    setRefreshing(true);

    loadPackages(userId);

    setRefreshing(false);
  }, [loadPackages, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    loadPackages(userId);
  }, [loadPackages, userId]);

  const handleOpenUpdateModal = useCallback(
    (pkg: Package) => {
      setSelectedPackage(pkg);

      updateStatusModalRef.current?.present();
    },
    [],
  );

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
    [handleOpenUpdateModal, navigation],
  );

  const keyExtractor = useCallback(
    (item: Package) => String(item.id ?? item.code),
    [],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <Input
          placeholder={t("packages.list.searchPlaceholder")}
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
              label={t("packages.list.all")}
              value=""
              style={styles.pickerLabel}
            />

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
      </View>
    ),
    [
      searchTerm,
      setSearchTerm,
      setStatusFilter,
      statusFilter,
      t,
    ],
  );

  return (
    <ScreenContainer
      headerTitle={t("packages.list.title")}
      withGradientBackground
    >
      <View style={styles.container}>
        {packages.length === 0 ? (
          <View style={styles.emptyScreenContainer}>
            <Text style={styles.emptyScreenText}>
              {t("packages.list.empty")}
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

      {selectedPackage && userId ? (
        <UpdateStatusModal
          ref={updateStatusModalRef}
          handleCloseModal={() =>
            updateStatusModalRef.current?.close()
          }
          packageData={selectedPackage}
          userId={userId}
        />
      ) : null}
    </ScreenContainer>
  );
}
