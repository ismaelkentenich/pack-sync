import React from "react";
import { Modal, Text, View } from "react-native";
import { Button } from "@components/primitives/Button";
import { styles } from "./styles";
import type { CustomAlertProps } from "./types";

export function CustomAlert({
  visible,
  title,
  message,
  onClose,
  confirmText,
  testID,
  containerStyle,
}: CustomAlertProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
      testID={testID ?? "customAlertModal"}
    >
      <View
        testID="customAlertOverlay"
        style={styles.overlay}
      >
        <View
          testID="customAlertContainer"
          style={[styles.container, containerStyle]}
          accessibilityViewIsModal
        >
          <View
            testID="customAlertContent"
            style={styles.content}
          >
            {title ? (
              <Text
                testID="customAlertTitle"
                style={styles.title}
                accessibilityRole="header"
              >
                {title}
              </Text>
            ) : null}

            <Text
              testID="customAlertMessage"
              style={styles.message}
              accessibilityRole="alert"
            >
              {message}
            </Text>
          </View>

          <View
            testID="customAlertActions"
            style={styles.actions}
          >
            <Button
              title={confirmText}
              onPress={onClose}
              testID="customAlertConfirmButton"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
