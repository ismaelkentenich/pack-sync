import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Routes } from "@app/navigation/routes";
import Button from "@components/primitives/Button";
import Input from "@components/primitives/Input";
import ScreenContainer from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { getAuthErrorMessage } from "@features/auth/utils/getAuthErrorMessage";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { useShowAlert } from "@store/useAlertStore";
import {
  isEmailValid,
  isPasswordValid,
} from "@utils/validators";
import { styles } from "./styles";

export default function LoginScreen() {
  const { t } = useTranslation();

  const navigation = useAppNavigation(Routes.Login);
  const login = useAuthStore((state) => state.login);
  const showAlert = useShowAlert((state) => state.show);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert(
        t("auth.validation.requiredFields"),
        "error",
      );
      return;
    }

    if (!isEmailValid(email)) {
      showAlert(t("auth.validation.invalidEmail"), "error");
      return;
    }

    if (!isPasswordValid(password)) {
      showAlert(
        t("auth.validation.invalidPassword"),
        "error",
      );
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      showAlert(getAuthErrorMessage(error, t), "error");
    }
  };

  return (
    <ScreenContainer
      withHeader={false}
      withKeyboardAvoiding
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          {t("auth.login.title")}
        </Text>

        <Input
          label={t("common.email")}
          placeholder={t("auth.login.emailPlaceholder")}
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label={t("common.password")}
          placeholder={t("auth.login.passwordPlaceholder")}
          value={password}
          onChangeText={setPassword}
          secure
        />

        <View style={styles.buttonContainer}>
          <Button
            title={t("auth.login.submit")}
            onPress={handleLogin}
          />

          <Button
            title={t("auth.login.signup")}
            onPress={() => navigation.navigate("SignUp")}
            variant="outline"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
