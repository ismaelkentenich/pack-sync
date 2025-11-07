import Card from "@components/Card";
import ScreenContainer from "@components/ScreenContainer";
import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { styles } from "./styles";
import { usePackageStore } from "@store/packages/usePackageStore";

export default function PackagesListScreen() {
  const { packages, loadPackages } = usePackageStore();

  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {packages.length === 0 ? (
          <Text style={styles.emptyScreenText}>Nenhum pacote encontrado</Text>
        ) : (
          <FlatList
            data={packages}
            contentContainerStyle={styles.flatlistContainer}
            keyExtractor={(item) => String(item.id ?? item.code)}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.cardText}>Código: {item.code}</Text>
                  <Text>Status: {item.status}</Text>
                  <Text>Cliente: {item.clientName ?? "—"}</Text>
                  <Text>Escaneado em: {new Date(item.scanned_at).toLocaleString()}</Text>
                </View>
              </Card>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
