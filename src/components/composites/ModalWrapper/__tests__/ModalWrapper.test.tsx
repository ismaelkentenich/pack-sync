import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { createRef, type ReactNode } from "react";
import { Keyboard, Text } from "react-native";
import Theme from "@theme/theme";
import {
  ModalCloseIcon,
  ModalWrapper,
} from "../ModalWrapper";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

let mockIsKeyboardOpened = false;

const mockExpand = jest.fn();
const mockSnapToIndex = jest.fn();
const mockClose = jest.fn();
const mockPresent = jest.fn();

jest.mock("@hooks/useIsKeyboardOpened", () => ({
  useIsKeyboardOpened: () => mockIsKeyboardOpened,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const React = jest.requireActual("react");

  return {
    useSafeAreaInsets: () => ({
      top: 10,
      right: 0,
      bottom: 20,
      left: 0,
    }),

    SafeAreaView: ({
      children,
      testID,
      style,
      edges,
    }: {
      children: ReactNode;
      testID?: string;
      style?: unknown;
      edges?: string[];
    }) =>
      React.createElement(
        "SafeAreaView",
        {
          testID,
          style,
          edges,
        },
        children,
      ),
  };
});

jest.mock("@gorhom/bottom-sheet", () => {
  const React = jest.requireActual("react");

  const BottomSheetModalMock = React.forwardRef(
    function MockBottomSheetModal(
      {
        children,
        ...props
      }: {
        children?: ReactNode;
        [key: string]: unknown;
      },
      ref: React.ForwardedRef<unknown>,
    ) {
      React.useImperativeHandle(
        ref,
        () => ({
          expand: mockExpand,
          snapToIndex: mockSnapToIndex,
          close: mockClose,
          present: mockPresent,
        }),
        [],
      );

      return React.createElement(
        "BottomSheetModal",
        {
          testID: "mockBottomSheetModal",
          ...props,
        },
        children,
      );
    },
  );

  const BottomSheetViewMock = ({
    children,
    testID,
    style,
  }: {
    children?: ReactNode;
    testID?: string;
    style?: unknown;
  }) =>
    React.createElement(
      "BottomSheetView",
      {
        testID,
        style,
      },
      children,
    );

  const BottomSheetBackdropMock = ({
    pressBehavior,
    disappearsOnIndex,
    appearsOnIndex,
  }: {
    pressBehavior?: unknown;
    disappearsOnIndex?: number;
    appearsOnIndex?: number;
  }) =>
    React.createElement("BottomSheetBackdrop", {
      testID: "mockBottomSheetBackdrop",
      pressBehavior,
      disappearsOnIndex,
      appearsOnIndex,
    });

  return {
    BottomSheetModal: BottomSheetModalMock,
    BottomSheetView: BottomSheetViewMock,
    BottomSheetBackdrop: BottomSheetBackdropMock,
  };
});

describe("Modal Component", () => {
  describe("ModalWrapper", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      mockIsKeyboardOpened = false;
    });

    describe("rendering", () => {
      it("renders content with the default testID", () => {
        const { getByTestId } = render(
          <ModalWrapper>
            <Text testID="modalChild">Modal content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("modalWrapperContent"),
        ).toBeTruthy();

        expect(getByTestId("modalChild")).toHaveTextContent(
          "Modal content",
        );
      });

      it("uses a custom content testID", () => {
        const { getByTestId, queryByTestId } = render(
          <ModalWrapper testID="updateStatusModal">
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("updateStatusModal"),
        ).toBeTruthy();

        expect(
          queryByTestId("modalWrapperContent"),
        ).toBeNull();
      });

      it("renders safe area", () => {
        const { getByTestId } = render(
          <ModalWrapper>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("modalWrapperSafeArea"),
        ).toBeTruthy();
      });

      it("renders keyboard avoiding container", () => {
        const { getByTestId } = render(
          <ModalWrapper>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("modalWrapperKeyboardAvoiding"),
        ).toBeTruthy();
      });
    });

    describe("configuration", () => {
      it("uses default snap points", () => {
        const { getByTestId } = render(
          <ModalWrapper>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("mockBottomSheetModal"),
        ).toHaveProp("snapPoints", ["60%", "75%", "95%"]);
      });

      it("uses custom snap points", () => {
        const { getByTestId } = render(
          <ModalWrapper snapPoints={["40%", "80%"]}>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("mockBottomSheetModal"),
        ).toHaveProp("snapPoints", ["40%", "80%"]);
      });

      it("allows pan down close by default", () => {
        const { getByTestId } = render(
          <ModalWrapper>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("mockBottomSheetModal"),
        ).toHaveProp("enablePanDownToClose", true);
      });

      it("blocks pan down close when blocked", () => {
        const { getByTestId } = render(
          <ModalWrapper isBlocked>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("mockBottomSheetModal"),
        ).toHaveProp("enablePanDownToClose", false);
      });

      it("enables content and handle panning by default", () => {
        const { getByTestId } = render(
          <ModalWrapper>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        const modal = getByTestId("mockBottomSheetModal");

        expect(modal).toHaveProp(
          "enableHandlePanningGesture",
          true,
        );

        expect(modal).toHaveProp(
          "enableContentPanningGesture",
          true,
        );
      });

      it("disables panning when modal is fixed", () => {
        const { getByTestId } = render(
          <ModalWrapper isModalFixed>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        const modal = getByTestId("mockBottomSheetModal");

        expect(modal).toHaveProp(
          "enableHandlePanningGesture",
          false,
        );

        expect(modal).toHaveProp(
          "enableContentPanningGesture",
          false,
        );
      });

      it("passes onDismiss to bottom sheet", () => {
        const onDismiss = jest.fn();

        const { getByTestId } = render(
          <ModalWrapper onDismiss={onDismiss}>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("mockBottomSheetModal"),
        ).toHaveProp("onDismiss", onDismiss);
      });
    });

    describe("safe area", () => {
      it("adds safe-area inset to bottom padding", () => {
        const { getByTestId } = render(
          <ModalWrapper>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("modalWrapperContent"),
        ).toHaveStyle({
          paddingBottom: 20 + Theme.spacing.xl,
        });
      });

      it("applies custom styles", () => {
        const { getByTestId } = render(
          <ModalWrapper
            style={{
              paddingHorizontal: Theme.spacing.md,
            }}
          >
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(
          getByTestId("modalWrapperContent"),
        ).toHaveStyle({
          paddingHorizontal: Theme.spacing.md,
        });
      });
    });

    describe("keyboard", () => {
      it("snaps to the first index when keyboard is closed", () => {
        const ref = createRef<BottomSheetModal>();

        render(
          <ModalWrapper ref={ref}>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(mockSnapToIndex).toHaveBeenCalledWith(0);
      });

      it("expands when keyboard opens and modal has input", () => {
        mockIsKeyboardOpened = true;

        const ref = createRef<BottomSheetModal>();

        render(
          <ModalWrapper ref={ref} hasInputInsideModal>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(mockExpand).toHaveBeenCalledTimes(1);

        expect(mockSnapToIndex).not.toHaveBeenCalled();
      });

      it("does not expand when keyboard opens without input", () => {
        mockIsKeyboardOpened = true;

        const ref = createRef<BottomSheetModal>();

        render(
          <ModalWrapper ref={ref}>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        expect(mockExpand).not.toHaveBeenCalled();
      });

      it("dismisses keyboard when dismiss area is pressed", () => {
        const dismissSpy = jest
          .spyOn(Keyboard, "dismiss")
          .mockImplementation(() => {});

        const { getByTestId } = render(
          <ModalWrapper>
            <Text>Content</Text>
          </ModalWrapper>,
        );

        fireEvent.press(
          getByTestId("modalWrapperDismissKeyboardArea"),
        );

        expect(dismissSpy).toHaveBeenCalledTimes(1);

        dismissSpy.mockRestore();
      });
    });
  });

  describe("ModalCloseIcon", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <ModalCloseIcon onPress={jest.fn()} />,
      );

      expect(getByTestId("modalCloseButton")).toBeTruthy();
    });

    it("uses a custom testID", () => {
      const { getByTestId, queryByTestId } = render(
        <ModalCloseIcon
          onPress={jest.fn()}
          testID="closeUpdateModal"
        />,
      );

      expect(getByTestId("closeUpdateModal")).toBeTruthy();

      expect(queryByTestId("modalCloseButton")).toBeNull();
    });

    it("calls onPress", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <ModalCloseIcon onPress={onPress} />,
      );

      fireEvent.press(getByTestId("modalCloseButton"));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("has button accessibility role", () => {
      const { getByTestId } = render(
        <ModalCloseIcon onPress={jest.fn()} />,
      );

      expect(getByTestId("modalCloseButton")).toHaveProp(
        "accessibilityRole",
        "button",
      );
    });

    it("uses translated accessibility label", () => {
      const { getByTestId } = render(
        <ModalCloseIcon onPress={jest.fn()} />,
      );

      expect(getByTestId("modalCloseButton")).toHaveProp(
        "accessibilityLabel",
        "accessibility.modal.close",
      );
    });

    it("accepts a custom accessibility label", () => {
      const { getByTestId } = render(
        <ModalCloseIcon
          onPress={jest.fn()}
          accessibilityLabel="Close status editor"
        />,
      );

      expect(getByTestId("modalCloseButton")).toHaveProp(
        "accessibilityLabel",
        "Close status editor",
      );
    });

    it("renders the close icon", () => {
      const { getAllByTestId } = render(
        <ModalCloseIcon onPress={jest.fn()} />,
      );

      expect(
        getAllByTestId("modalCloseIcon").length,
      ).toBeGreaterThan(0);
    });
  });
});
