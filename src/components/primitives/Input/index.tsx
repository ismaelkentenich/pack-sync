import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import Theme from "@theme/theme";
import { styles } from "./styles";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  secure?: boolean;
};

export default function Input({
  label,
  error,
  containerStyle,
  style,
  secure = false,
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          error && styles.inputError,
        ]}
      >
        <TextInput
          placeholderTextColor={Theme.colors.neutral[400]}
          style={[styles.input, style]}
          secureTextEntry={secure && !isPasswordVisible}
          {...rest}
        />

        {secure && (
          <TouchableOpacity
            onPress={() =>
              setIsPasswordVisible((prev) => !prev)
            }
            style={styles.iconButton}
          >
            {isPasswordVisible ? (
              <EyeOff
                size={Theme.sizing.icon.sm}
                color={Theme.colors.neutral[500]}
              />
            ) : (
              <Eye
                size={Theme.sizing.icon.sm}
                color={Theme.colors.neutral[500]}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}
