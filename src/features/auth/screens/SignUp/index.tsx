import { ArrowLeft, Package } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { Routes } from "@app/navigation/routes";
import { Button } from "@components/primitives/Button";
import { Input } from "@components/primitives/Input";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { getAuthErrorMessage } from "@features/auth/utils/getAuthErrorMessage";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { useShowAlert } from "@store/useAlertStore";
import Theme from "@theme/theme";
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (isSubmitting) {
      return;
    }

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

    setIsSubmitting(true);

    try {
      await signup(email, password);

      showAlert(t("auth.signup.success"), "success");
    } catch (error) {
      showAlert(getAuthErrorMessage(error, t), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ScreenContainer
      testID="signupScreen"
      scrollable
      withHeader={false}
      withKeyboardAvoiding
      backgroundColorVariant="neutral100"
      contentContainerStyle={styles.screenContent}
      withSafeArea={false}
    >
      <View
        testID="signupDecoration"
        pointerEvents="none"
        style={styles.decoration}
      >
        <View style={styles.decorationLarge} />

        <View style={styles.decorationSmall} />
      </View>

      <View testID="signupContent" style={styles.container}>
        <TouchableOpacity
          testID="signupBackButton"
          accessibilityRole="button"
          accessibilityLabel={t(
            "accessibility.header.back",
          )}
          onPress={handleBackToLogin}
          disabled={isSubmitting}
          style={styles.backButton}
        >
          <ArrowLeft
            testID="signupBackIcon"
            size={Theme.sizing.icon.sm}
            color={Theme.colors.primary[700]}
          />

          <Text
            testID="signupBackText"
            style={styles.backText}
          >
            {t("auth.signup.backToLogin")}
          </Text>
        </TouchableOpacity>

        <View
          testID="signupBrand"
          style={styles.brandContainer}
        >
          <View
            testID="signupBrandIconContainer"
            style={styles.brandIconContainer}
          >
            <Package
              testID="signupBrandIcon"
              size={Theme.sizing.icon.lg}
              color={Theme.colors.neutral[900]}
            />
          </View>
        </View>

        <View
          testID="signupIntroduction"
          style={styles.introduction}
        >
          <Text
            testID="signupTitle"
            style={styles.title}
            accessibilityRole="header"
          >
            {t("auth.signup.title")}
          </Text>

          <Text
            testID="signupDescription"
            style={styles.description}
          >
            {t("auth.signup.description")}
          </Text>
        </View>

        <View testID="signupForm" style={styles.form}>
          <View style={styles.formInputWrapper}>
            <Input
              testID="signupEmailInput"
              label={t("common.email")}
              placeholder={t(
                "auth.signup.emailPlaceholder",
              )}
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
              testID="signupPasswordInput"
              label={t("common.password")}
              placeholder={t(
                "auth.signup.passwordPlaceholder",
              )}
              value={password}
              onChangeText={setPassword}
              editable={!isSubmitting}
              secure
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="next"
            />

            <Input
              testID="signupConfirmPasswordInput"
              label={t("auth.signup.confirmPassword")}
              placeholder={t(
                "auth.signup.confirmPasswordPlaceholder",
              )}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isSubmitting}
              secure
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
          </View>

          <Button
            testID="signupSubmitButton"
            title={t("auth.signup.submit")}
            variant="brand"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSignup}
          />
        </View>

        <View
          testID="signupLoginSection"
          style={styles.loginSection}
        >
          <Text
            testID="signupLoginHint"
            style={styles.loginHint}
          >
            {t("auth.signup.alreadyHaveAccount")}
          </Text>

          <TouchableOpacity
            testID="signupLoginButton"
            accessibilityRole="button"
            onPress={handleBackToLogin}
            disabled={isSubmitting}
            style={styles.loginButton}
          >
            <Text
              testID="signupLoginText"
              style={styles.loginText}
            >
              {t("auth.signup.login")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
