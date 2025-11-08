import Card from "@components/Card";
import ScreenContainer from "@components/ScreenContainer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { styles } from "./styles";
import { usePackageStore } from "@store/packages/usePackageStore";
import Input from "@components/Input";
import Theme from "@theme/theme";
import { useAppNavigation } from "@hooks/useAppNavigation";
import PackageCard from "@components/PackageCard";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Package } from "@services/database/packages/packages";
import UpdateStatusModal from "@features/packages/components/UpdateStatusModal";

export default function PackagesListScreen() {
  const navigation = useAppNavigation("PackagesList");
  const updateStatusModalRef = useRef<BottomSheetModal>(null);
  const { packages, loadPackages } = usePackageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

  const filteredPackages = packages.filter((pkg) =>
    normalize(pkg.code).includes(normalize(searchTerm)),
  );

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

  return (
    <ScreenContainer headerTitle="Lista de Pacotes">
      <View style={styles.container}>
        {packages.length === 0 ? (
          <View style={styles.emptyScreenContainer}>
            <Text style={styles.emptyScreenText}>Nenhum pacote encontrado</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPackages}
            contentContainerStyle={styles.flatlistContainer}
            ListHeaderComponent={
              <View>
                <Input
                  placeholder="Buscar por código..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            }
            keyExtractor={(item) => String(item.id ?? item.code)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Theme.colors.primary[500]]}
              />
            }
            renderItem={({ item }) => (
              <PackageCard
                item={item}
                onPress={() => navigation.navigate("PackageDetails", { pkg: item })}
                onPressUpdate={() => handleOpenUpdateModal(item)}
                showButtons={true}
              />
            )}
          />
        )}
      </View>

      {selectedPackage && (
        <UpdateStatusModal
          ref={updateStatusModalRef}
          handleCloseModal={() => updateStatusModalRef.current?.close()}
          packageId={selectedPackage.id!}
          packageCode={selectedPackage.code}
          currentStatus={selectedPackage.status}
        />
      )}
    </ScreenContainer>
  );
}
