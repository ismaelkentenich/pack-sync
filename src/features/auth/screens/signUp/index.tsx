import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import Button from "@components/Button";
import Input from "@components/Input";
import ScreenContainer from "@components/ScreenContainer";
import { useAuthStore } from "@store/auth/useAuthStore";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { Routes } from "@app/navigation/routes";
import { styles } from "./styles";

export default function SignupScreen() {
  const navigation = useAppNavigation(Routes.SignUp);
  const signup = useAuthStore((state) => state.signup);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      await signup(email, password);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro ao cadastrar", error.message || "Tente novamente.");
    }
  };

  return (
    <ScreenContainer scrollable withHeader={false} withKeyboardAvoiding>
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
          <Button title="Cadastrar" onPress={handleSignup} />
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
