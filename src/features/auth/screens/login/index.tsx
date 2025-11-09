import { Routes } from "@app/navigation/routes";
import Button from "@components/Button";
import Input from "@components/Input";
import ScreenContainer from "@components/ScreenContainer";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { useShowAlert } from "@hooks/useShowAlert";
import { isEmailValid, isPasswordValid } from "@utils/validators";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAuthStore } from "src/store/auth/useAuthStore";
import { styles } from "./styles";

export default function LoginScreen() {
  const navigation = useAppNavigation(Routes.Login);
  const login = useAuthStore((state) => state.login);
  const showAlert = useShowAlert((state) => state.show);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Preencha todos os campos.", "error");
      return;
    }

    if (!isEmailValid(email)) {
      showAlert("Digite um e-mail válido.", "error");
      return;
    }

    if (!isPasswordValid(password)) {
      showAlert("A senha deve ter pelo menos 6 caracteres.", "error");
      return;
    }

    try {
      await login(email, password);
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Verifique suas credenciais.";
      showAlert(message, "error");
    }
  };

  return (
    <ScreenContainer withHeader={false} withKeyboardAvoiding>
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
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

        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
          <Button
            title="Cadastrar"
            onPress={() => navigation.navigate("SignUp")}
            variant="outline"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
