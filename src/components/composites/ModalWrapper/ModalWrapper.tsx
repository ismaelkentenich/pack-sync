import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import { forwardRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useIsKeyboardOpened } from "@hooks/useIsKeyboardOpened";
import Theme from "@theme/theme";
import { styles } from "./styles";
import type {
  ModalCloseIconProps,
  ModalWrapperProps,
} from "./types";

export const ModalWrapper = forwardRef<
  BottomSheetModal,
  ModalWrapperProps
>(function ModalWrapper(
  {
    children,
    isBlocked = false,
    onDismiss,
    snapPoints,
    style,
    isModalFixed = false,
    hasInputInsideModal = false,
    testID,
  },
  ref,
) {
  const { isKeyboardOpened } = useIsKeyboardOpened();

  const insets = useSafeAreaInsets();

  const contentStyle = StyleSheet.flatten([
    styles.container,
    style,
    {
      paddingBottom: insets.bottom + Theme.spacing.xl,
    },
  ]);

  useEffect(() => {
    if (!ref || typeof ref === "function") {
      return;
    }

    const instance = ref.current;

    if (!instance) {
      return;
    }

    if (isKeyboardOpened && hasInputInsideModal) {
      instance.expand();
      return;
    }

    if (!isKeyboardOpened) {
      instance.snapToIndex(0);
    }
  }, [hasInputInsideModal, isKeyboardOpened, ref]);

  return (
    <BottomSheetModal
      ref={ref}
      handleIndicatorStyle={{
        display: "none",
      }}
      enablePanDownToClose={!isBlocked}
      onDismiss={onDismiss}
      snapPoints={snapPoints ?? ["60%", "75%", "95%"]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableHandlePanningGesture={!isModalFixed}
      enableContentPanningGesture={!isModalFixed}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={isBlocked ? "none" : "close"}
        />
      )}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          testID="modalWrapperDismissKeyboardArea"
          style={styles.dismissKeyboardArea}
        >
          <SafeAreaView
            testID="modalWrapperSafeArea"
            style={styles.safeAreaContainer}
            edges={["bottom"]}
          >
            <KeyboardAvoidingView
              testID="modalWrapperKeyboardAvoiding"
              behavior={
                Platform.OS === "ios" ? "padding" : "height"
              }
              style={styles.keyboardAvoiding}
              keyboardVerticalOffset={
                insets.bottom + Theme.spacing.xl
              }
            >
              <BottomSheetView
                testID={testID ?? "modalWrapperContent"}
                style={contentStyle}
              >
                {children}
              </BottomSheetView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </BottomSheetModal>
  );
});

export function ModalCloseIcon({
  onPress,
  testID,
  accessibilityLabel,
  ...rest
}: ModalCloseIconProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      {...rest}
      testID={testID ?? "modalCloseButton"}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? t("accessibility.modal.close")
      }
      onPress={onPress}
      style={[styles.closeIcon, rest.style]}
      hitSlop={{
        top: Theme.spacing.md,
        bottom: Theme.spacing.md,
        left: Theme.spacing.md,
        right: Theme.spacing.md,
      }}
    >
      <View
        testID="modalCloseIconContainer"
        style={styles.closeIconContent}
      >
        <X
          testID="modalCloseIcon"
          color={Theme.colors.neutral[700]}
          size={Theme.sizing.icon.md}
        />
      </View>
    </TouchableOpacity>
  );
}
