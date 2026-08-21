import { Routes } from "@app/navigation/routes";
import Button from "@components/primitives/Button";
import Input from "@components/primitives/Input";
import ScreenContainer from "@components/primitives/ScreenContainer";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { useShowAlert } from "@hooks/useShowAlert";
import { useAuthStore } from "@store/auth/useAuthStore";
import {
  isEmailValid,
  isPasswordValid,
} from "@utils/validators";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

export default function SignupScreen() {
  const navigation = useAppNavigation(Routes.SignUp);
  const signup = useAuthStore((state) => state.signup);
  const showAlert = useShowAlert((state) => state.show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      showAlert("Preencha todos os campos.", "error");
      return;
    }

    if (!isEmailValid(email)) {
      showAlert("Digite um e-mail válido.", "error");
      return;
    }

    if (!isPasswordValid(password)) {
      showAlert(
        "A senha deve ter pelo menos 6 caracteres.",
        "error",
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert("As senhas não coincidem.", "error");
      return;
    }

    try {
      await signup(email, password);
      showAlert("Conta criada com sucesso!", "success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Tente novamente.";
      showAlert(message, "error");
    }
  };

  return (
    <ScreenContainer
      scrollable
      withHeader={false}
      withKeyboardAvoiding
    >
      <View style={styles.container}>
        <Text style={styles.text}>Criar Conta</Text>
        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secure
        />
        <Input
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secure
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Cadastrar"
            onPress={handleSignup}
          />
          <Button
            title="Já tem conta?"
            onPress={() => navigation.navigate("Login")}
            variant="outline"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
