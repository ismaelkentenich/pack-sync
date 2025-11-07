import React from "react";
import { TextInput, TextInputProps, View, Text, StyleProp, ViewStyle } from "react-native";
import { styles } from "./styles";
import Theme from "@theme/theme";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function Input({ label, error, containerStyle, style, ...rest }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        placeholderTextColor={Theme.colors.neutral[400]}
        style={[styles.input, style, error && styles.inputError]}
        {...rest}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
