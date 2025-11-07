import Button from "@components/Button";
import Input from "@components/Input";
import ScreenContainer from "@components/ScreenContainer";
import { useAppNavigation } from "@hooks/useAppNavigation";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useAuthStore } from "src/store/auth/useAuthStore";
import { styles } from "./styles";
import { Routes } from "@app/navigation/routes";

export default function LoginScreen() {
  const navigation = useAppNavigation(Routes.Login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Erro", "Digite seu e-mail.");
      return;
    }

    try {
      await login(email);
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível fazer login.");
    }
  };

  return (
    <ScreenContainer scrollable withHeader={false}>
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

        <Button title="Login" onPress={handleLogin} />
      </View>
    </ScreenContainer>
  );
}
