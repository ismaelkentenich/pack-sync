import { Eye, EyeOff } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Theme from "@theme/theme";
import { styles } from "./styles";
import { getInputColors } from "./utils/getInputColors";
import type { InputProps, InputState } from "./types";

export function Input({
  label,
  error,
  secure = false,
  editable = true,
  containerStyle,
  inputStyle,
  testID,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const { t } = useTranslation();

  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  const state = useMemo<InputState>(() => {
    if (!editable) {
      return "disabled";
    }

    if (error) {
      return "error";
    }

    if (isFocused) {
      return "focused";
    }

    return "default";
  }, [editable, error, isFocused]);

  const colors = getInputColors(state);

  return (
    <View
      testID={testID ?? "inputRoot"}
      style={[styles.container, containerStyle]}
    >
      {label ? (
        <Text
          testID="inputLabel"
          style={[
            styles.label,
            {
              color: colors.labelColor,
            },
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        testID="inputWrapper"
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.backgroundColor,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <TextInput
          {...rest}
          testID="inputField"
          editable={editable}
          placeholderTextColor={colors.placeholderColor}
          secureTextEntry={secure && !isPasswordVisible}
          style={[
            styles.input,
            {
              color: colors.textColor,
            },
            inputStyle,
          ]}
          accessibilityState={{
            disabled: !editable,
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />

        {secure ? (
          <TouchableOpacity
            testID="inputTogglePassword"
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible
                ? t("accessibility.input.hidePassword")
                : t("accessibility.input.showPassword")
            }
            accessibilityState={{
              disabled: !editable,
            }}
            onPress={() =>
              setIsPasswordVisible((current) => !current)
            }
            disabled={!editable}
            style={styles.iconButton}
          >
            {isPasswordVisible ? (
              <EyeOff
                testID="inputEyeOffIcon"
                size={Theme.sizing.icon.sm}
                color={Theme.colors.neutral[500]}
              />
            ) : (
              <Eye
                testID="inputEyeIcon"
                size={Theme.sizing.icon.sm}
                color={Theme.colors.neutral[500]}
              />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text
          testID="inputError"
          style={styles.errorText}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
