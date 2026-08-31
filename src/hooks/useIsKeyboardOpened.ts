import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardEvent,
  Platform,
} from "react-native";

export type KeyboardState = {
  isKeyboardOpened: boolean;
  keyboardHeight: number;
};

export function useIsKeyboardOpened(): KeyboardState {
  const [isKeyboardOpened, setIsKeyboardOpened] =
    useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios"
        ? "keyboardWillShow"
        : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios"
        ? "keyboardWillHide"
        : "keyboardDidHide";

    const onKeyboardShow = (event: KeyboardEvent) => {
      setIsKeyboardOpened(true);
      setKeyboardHeight(event.endCoordinates.height);
    };

    const onKeyboardHide = () => {
      setIsKeyboardOpened(false);
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(
      showEvent,
      onKeyboardShow,
    );
    const hideSub = Keyboard.addListener(
      hideEvent,
      onKeyboardHide,
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isKeyboardOpened, keyboardHeight };
}
