import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { forwardRef, ReactNode, Ref, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { X } from "lucide-react-native";
import Theme from "@theme/theme";
import { useIsKeyboardOpened } from "@hooks/useIsKeyboardOpened";

interface ModalWrapperProps {
  children: ReactNode;
  isBlocked?: boolean;
  onDismiss?(): void;
  style?: ViewProps["style"];
  snapPoints?: (string | number)[];
  isModalFixed?: boolean;
  hasInputInsideModal?: boolean;
}

interface CloseIconProps extends TouchableOpacityProps {
  onPress(): void;
}

export const ModalWrapper = forwardRef(
  (
    {
      children,
      isBlocked = false,
      onDismiss,
      snapPoints,
      style,
      isModalFixed = false,
      hasInputInsideModal,
    }: ModalWrapperProps,
    ref: Ref<BottomSheetModal>,
  ) => {
    const isKeyboardOpened = useIsKeyboardOpened();
    const insets = useSafeAreaInsets();

    useEffect(() => {
      if (!ref || typeof ref === "function") return;
      const instance = ref.current;
      if (!instance) return;
      if (isKeyboardOpened && hasInputInsideModal) {
        instance.expand();
      } else if (!isKeyboardOpened) {
        instance.snapToIndex(0);
      }
    }, [hasInputInsideModal, isKeyboardOpened, ref]);

    return (
      <BottomSheetModal
        ref={ref}
        handleIndicatorStyle={{ display: "none" }}
        enablePanDownToClose={!isBlocked}
        onDismiss={onDismiss}
        snapPoints={snapPoints || ["60%", "75%", "95%"]}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        enableHandlePanningGesture={!isModalFixed}
        enableContentPanningGesture={!isModalFixed}
        backdropComponent={(props) => (
          <>
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior={isBlocked ? "none" : "close"}
            />
          </>
        )}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={[styles.safeAreaContainer]} edges={["bottom"]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={insets.bottom + 24}
            >
              <BottomSheetView
                style={[styles.container, style, { paddingBottom: insets.bottom + 24 }]}
              >
                {children}
              </BottomSheetView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </BottomSheetModal>
    );
  },
);

export const ModalCloseIcon = ({ onPress, ...rest }: CloseIconProps) => {
  return (
    <TouchableOpacity
      testID="closeModalButton"
      onPress={onPress}
      style={styles.closeIcon}
      hitSlop={{
        top: 16,
        bottom: 16,
        left: 16,
        right: 16,
      }}
      {...rest}
    >
      <View>
        <X color={Theme.colors.neutral[200]} size={24} />
      </View>
    </TouchableOpacity>
  );
};
