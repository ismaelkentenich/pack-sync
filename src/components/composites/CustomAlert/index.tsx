import { useShowAlert } from "@store/useAlertStore";
import { styles } from "./styles";
import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

type CustomAlertProps = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
};

function CustomAlert({
  visible,
  title,
  message,
  onClose,
  confirmText = "OK",
}: CustomAlertProps) {
  useEffect(() => {
    if (visible) {
      // você pode adicionar animação ou som aqui
    }
  }, [visible]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}
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
  const { visible, message, type, hide } = useShowAlert();

  return (
    <CustomAlert
      visible={visible}
      message={message}
      onClose={hide}
      confirmText="OK"
    />
  );
}
