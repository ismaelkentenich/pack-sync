import { ArrowRight, Package } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircleBackground } from "@components/primitives/AnimatedCircleBackground";
import { Button } from "@components/primitives/Button";
import { Input } from "@components/primitives/Input";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { Routes } from "@config/routes";
import { useAuthOperations } from "@features/auth/hooks/useAuthOperations";
import { getAuthErrorMessage } from "@features/auth/utils/getAuthErrorMessage";
import { useAuthNavigation } from "@hooks/useAuthNavigation";
import { useShowAlert } from "@store/useAlertStore";
import Theme from "@theme/theme";
import {
  isEmailValid,
  isPasswordValid,
} from "@utils/validators";
import { styles } from "./styles";

export default function LoginScreen() {
  const { t } = useTranslation();

  const navigation = useAuthNavigation();

  const { login } = useAuthOperations();

  const showAlert = useShowAlert((state) => state.show);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }

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

    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (error) {
      showAlert(getAuthErrorMessage(error, t), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate(Routes.SignUp);
  };

  return (
    <ScreenContainer
      testID="loginScreen"
      withHeader={false}
      withKeyboardAvoiding
      scrollable
      backgroundColorVariant="neutral100"
      contentContainerStyle={styles.screenContent}
      withSafeArea={false}
    >
      <View
        testID="loginDecoration"
        pointerEvents="none"
        style={styles.decoration}
      >
        <AnimatedCircleBackground variant="dense" />
      </View>

      <View testID="loginContent" style={styles.container}>
        <View
          testID="loginBrand"
          style={styles.brandContainer}
        >
          <View
            testID="loginBrandIconContainer"
            style={styles.brandIconContainer}
          >
            <Package
              testID="loginBrandIcon"
              size={Theme.sizing.icon.lg}
              color={Theme.colors.neutral[900]}
            />
          </View>
        </View>

        <View
          testID="loginIntroduction"
          style={styles.introduction}
        >
          <Text
            testID="loginTitle"
            style={styles.title}
            accessibilityRole="header"
          >
            {t("auth.login.title")}
          </Text>

          <Text
            testID="loginDescription"
            style={styles.description}
          >
            {t("auth.login.description")}
          </Text>
        </View>

        <View testID="loginForm" style={styles.form}>
          <View style={styles.formInputWrapper}>
            <Input
              testID="loginEmailInput"
              label={t("common.email")}
              placeholder={t("auth.login.emailPlaceholder")}
              value={email}
              onChangeText={setEmail}
              editable={!isSubmitting}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              returnKeyType="next"
            />

            <Input
              testID="loginPasswordInput"
              label={t("common.password")}
              placeholder={t(
                "auth.login.passwordPlaceholder",
              )}
              value={password}
              onChangeText={setPassword}
              editable={!isSubmitting}
              secure
              textContentType="password"
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <Button
            testID="loginSubmitButton"
            title={t("auth.login.submit")}
            variant="brand"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleLogin}
          />
        </View>

        <View
          testID="loginSignupSection"
          style={styles.signupSection}
        >
          <Text
            testID="loginSignupHint"
            style={styles.signupHint}
          >
            {t("auth.login.noAccount")}
          </Text>

          <TouchableOpacity
            testID="loginSignupButton"
            accessibilityRole="button"
            onPress={handleSignup}
            disabled={isSubmitting}
            style={styles.signupButton}
          >
            <Text
              testID="loginSignupText"
              style={styles.signupText}
            >
              {t("auth.login.signup")}
            </Text>

            <ArrowRight
              testID="loginSignupIcon"
              size={Theme.sizing.icon.xs}
              color={Theme.colors.primary[600]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
