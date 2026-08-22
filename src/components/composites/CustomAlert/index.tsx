import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useShowAlert } from "@store/useAlertStore";
import { styles } from "./styles";

type CustomAlertProps = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText: string;
};

function CustomAlert({
  visible,
  title,
  message,
  onClose,
  confirmText,
}: CustomAlertProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : null}

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            onPress={onClose}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function GlobalAlert() {
  const { t } = useTranslation();

  const { visible, message, hide } = useShowAlert();

  return (
    <CustomAlert
      visible={visible}
      message={message}
      onClose={hide}
      confirmText={t("common.ok")}
    />
  );
}
