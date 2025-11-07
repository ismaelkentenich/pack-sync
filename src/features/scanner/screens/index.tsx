import ScreenContainer from "@components/ScreenContainer";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

export default function ScanScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Scan</Text>
      </View>
    </ScreenContainer>
  );
}
