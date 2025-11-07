import React, { useState } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import ScreenContainer from "@components/ScreenContainer";
import Input from "@components/Input";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          error="E-mail inválido"
        />
      </View>
    </ScreenContainer>
  );
}
