import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import Theme from "@theme/theme";
import { styles } from "./styles";

type HeaderProps = {
  title?: string;
  showBack?: boolean;
};

export default function Header({ title, showBack = true }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={Theme.colors.neutral[50]} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.placeholder} />
    </View>
  );
}
