import Card from "@components/Card";
import ScreenContainer from "@components/ScreenContainer";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { styles } from "./styles";
import { usePackageStore } from "@store/packages/usePackageStore";
import Input from "@components/Input";
import Theme from "@theme/theme";

export default function PackagesListScreen() {
  const { packages, loadPackages } = usePackageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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
              <Card style={styles.card}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.cardText}>Código: {item.code}</Text>
                  <Text style={styles.cardText}>Status: {item.status}</Text>
                  <Text style={styles.cardText}>
                    Escaneado em: {new Date(item.scanned_at).toLocaleString()}
                  </Text>
                </View>
              </Card>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
