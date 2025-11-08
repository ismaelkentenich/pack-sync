import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { forwardRef, ReactNode, Ref } from "react";
import {
  Keyboard,
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

interface ModalWrapperProps {
  children: ReactNode;
  isBlocked?: boolean;
  onDismiss?(): void;
  style?: ViewProps["style"];
  snapPoints?: (string | number)[];
  isModalFixed?: boolean;
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
    }: ModalWrapperProps,
    ref: Ref<BottomSheetModal>,
  ) => {
    const insets = useSafeAreaInsets();

    return (
      <BottomSheetModal
        ref={ref}
        handleIndicatorStyle={{ display: "none" }}
        enablePanDownToClose={!isBlocked}
        onDismiss={onDismiss}
        snapPoints={snapPoints || ["55%", "75%"]}
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
            <BottomSheetView style={[styles.container, style, { paddingBottom: insets.bottom }]}>
              {children}
            </BottomSheetView>
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
