import Theme from "@theme/theme";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./styles";

type BadgeVariant = "status" | "delivery";

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export default function Badge({ label, variant, style }: BadgeProps) {
  const backgroundColor =
    variant === "status" ? Theme.colors.primary[200] : Theme.colors.secondary[200];
  const textColor = variant === "status" ? Theme.colors.primary[900] : Theme.colors.secondary[900];

  return (
    <View>
      <View style={[styles.container, { backgroundColor }, style]}>
        <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      </View>
    </View>
  );
}
