import Button from "@components/Button";
import Input from "@components/Input";
import ScreenContainer from "@components/ScreenContainer";
import { useAppNavigation } from "@hooks/useAppNavigation";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useAuthStore } from "src/store/auth/useAuthStore";
import { styles } from "./styles";
import { Routes } from "@app/navigation/routes";
import { useIsKeyboardOpened } from "@hooks/useIsKeyboardOpened";

export default function LoginScreen() {
  const navigation = useAppNavigation(Routes.Login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      await login(email, password);
      navigation.navigate("Home");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro ao entrar", error.message || "Verifique suas credenciais.");
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
