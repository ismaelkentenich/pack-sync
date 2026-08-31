import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Theme from "@theme/theme";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import { getInputColors } from "./utils/getInputColors";
import type { InputProps, InputState } from "./types";

const LABEL_ANIMATION_DURATION = 180;

export function Input({
  label,
  error,
  helperText,
  secure = false,
  editable = true,
  containerStyle,
  inputStyle,
  outlineStyle,
  labelStyle,
  testID,
  onFocus,
  onBlur,
  onChangeText,
  value,
  defaultValue,
  placeholder,
  ...rest
}: InputProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const [isFocused, setIsFocused] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  const [internalValue, setInternalValue] = useState(
    defaultValue ?? "",
  );

  const currentValue = value ?? internalValue;

  const hasValue = currentValue.length > 0;

  const shouldFloatLabel =
    Boolean(label) && (isFocused || hasValue);

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

  const colors = getInputColors(state, theme);

  const [labelAnimation] = useState(
    () => new Animated.Value(shouldFloatLabel ? 1 : 0),
  );

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: shouldFloatLabel ? 1 : 0,
      duration: LABEL_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [labelAnimation, shouldFloatLabel]);

  const labelTranslateY = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Theme.spacing.md, -Theme.spacing.sm],
  });

  const labelTranslateX = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -Theme.spacing.xxs],
  });

  const labelScale = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.82],
  });

  const handleChangeText = (text: string) => {
    setInternalValue(text);

    onChangeText?.(text);
  };

  const handlePasswordToggle = () => {
    setIsPasswordVisible((current) => !current);
  };

  const supportingText = error ?? helperText;

  return (
    <View
      testID={testID ?? "inputRoot"}
      style={[styles.container, containerStyle]}
    >
      <View
        testID="inputFieldContainer"
        style={styles.fieldContainer}
      >
        <View
          testID="inputWrapper"
          style={[
            styles.inputWrapper,

            isFocused &&
              editable &&
              styles.inputWrapperFocused,

            {
              backgroundColor: colors.backgroundColor,

              borderColor: colors.borderColor,
            },

            outlineStyle,
          ]}
        >
          <TextInput
            {...rest}
            testID="inputField"
            value={value}
            defaultValue={defaultValue}
            editable={editable}
            placeholder={
              shouldFloatLabel ? placeholder : undefined
            }
            placeholderTextColor={colors.placeholderColor}
            cursorColor={theme.colors.text.brand}
            selectionColor={
              theme.colors.surface.brandSubtle
            }
            secureTextEntry={secure && !isPasswordVisible}
            style={[
              styles.input,

              shouldFloatLabel &&
                styles.inputWithFloatingLabel,

              {
                color: colors.textColor,
              },

              inputStyle,
            ]}
            accessibilityLabel={
              rest.accessibilityLabel ?? label
            }
            accessibilityHint={
              rest.accessibilityHint ?? helperText
            }
            accessibilityState={{
              disabled: !editable,
              ...rest.accessibilityState,
            }}
            onChangeText={handleChangeText}
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
              disabled={!editable}
              onPress={handlePasswordToggle}
              style={styles.iconButton}
            >
              {isPasswordVisible ? (
                <EyeOff
                  testID="inputEyeOffIcon"
                  size={Theme.sizing.icon.sm}
                  color={colors.iconColor}
                />
              ) : (
                <Eye
                  testID="inputEyeIcon"
                  size={Theme.sizing.icon.sm}
                  color={colors.iconColor}
                />
              )}
            </TouchableOpacity>
          ) : null}
        </View>

        {label ? (
          <Animated.View
            testID="inputLabelContainer"
            pointerEvents="none"
            style={[
              styles.labelContainer,

              {
                backgroundColor: colors.backgroundColor,

                transform: [
                  {
                    translateY: labelTranslateY,
                  },

                  {
                    translateX: labelTranslateX,
                  },

                  {
                    scale: labelScale,
                  },
                ],
              },
            ]}
          >
            <Animated.Text
              testID="inputLabel"
              style={[
                styles.label,

                {
                  color: colors.labelColor,
                },

                labelStyle,
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        ) : null}
      </View>

      {supportingText ? (
        <Text
          testID={error ? "inputError" : "inputHelperText"}
          accessibilityRole={error ? "alert" : undefined}
          style={[
            styles.supportingText,

            {
              color: colors.supportingTextColor,
            },
          ]}
        >
          {supportingText}
        </Text>
      ) : null}
    </View>
  );
}
