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

export default function SignupScreen() {
  const { t } = useTranslation();

  const navigation = useAppNavigation(Routes.SignUp);
  const signup = useAuthStore((state) => state.signup);
  const showAlert = useShowAlert((state) => state.show);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      showAlert(
        t("auth.validation.passwordsDoNotMatch"),
        "error",
      );
      return;
    }

    try {
      await signup(email, password);

      showAlert(t("auth.signup.success"), "success");
    } catch (error) {
      showAlert(getAuthErrorMessage(error, t), "error");
    }
  };

  return (
    <ScreenContainer
      scrollable
      withHeader={false}
      withKeyboardAvoiding
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          {t("auth.signup.title")}
        </Text>

        <Input
          label={t("common.email")}
          placeholder={t("auth.signup.emailPlaceholder")}
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label={t("common.password")}
          placeholder={t("auth.signup.passwordPlaceholder")}
          value={password}
          onChangeText={setPassword}
          secure
        />

        <Input
          label={t("auth.signup.confirmPassword")}
          placeholder={t(
            "auth.signup.confirmPasswordPlaceholder",
          )}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secure
        />

        <View style={styles.buttonContainer}>
          <Button
            title={t("auth.signup.submit")}
            onPress={handleSignup}
          />

          <Button
            title={t("auth.signup.alreadyHaveAccount")}
            onPress={() => navigation.navigate("Login")}
            variant="outline"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
