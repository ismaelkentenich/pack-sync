import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import React, { type ReactNode } from "react";
import { Platform, Text } from "react-native";
import { lightTheme } from "@theme/appTheme";
import { ScreenContainer } from "../ScreenContainer";

const mockSetHeaderHeight = jest.fn();

jest.mock("@contexts/HeaderHeightContext", () => ({
  useHeaderHeight: () => ({
    headerHeight: 0,
    setHeaderHeight: mockSetHeaderHeight,
  }),
}));

jest.mock("@components/composites/Header", () => {
  const React = jest.requireActual("react");

  const { Text } = jest.requireActual("react-native");

  function MockHeader({
    title,
    showBack,
    showLogout,
    variant,
    onLayout,
  }: {
    title?: string;
    showBack?: boolean;
    showLogout?: boolean;
    variant?: string;
    onLayout?: (event: unknown) => void;
  }) {
    return React.createElement(
      Text,
      {
        testID: "mockHeader",
        accessibilityLabel: [
          title,
          String(showBack),
          String(showLogout),
          variant,
        ].join("|"),
        onLayout,
      },
      title,
    );
  }

  return {
    Header: MockHeader,
  };
});

jest.mock("react-native-safe-area-context", () => {
  const React = jest.requireActual("react");

  return {
    SafeAreaView: ({
      children,
      testID,
      style,
      edges,
    }: {
      children?: ReactNode;
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
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});

jest.mock("expo-linear-gradient", () => {
  const React = jest.requireActual("react");

  return {
    LinearGradient: ({
      children,
      ...props
    }: {
      children?: ReactNode;
      [key: string]: unknown;
    }) =>
      React.createElement(
        "LinearGradient",
        props,
        children,
      ),
  };
});

describe("ScreenContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerRoot"),
      ).toBeTruthy();
    });

    it("uses a custom root testID", () => {
      const { getByTestId, queryByTestId } = render(
        <ScreenContainer testID="homeScreen">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(getByTestId("homeScreen")).toBeTruthy();

      expect(
        queryByTestId("screenContainerRoot"),
      ).toBeNull();
    });

    it("renders children", () => {
      const { getByTestId } = render(
        <ScreenContainer>
          <Text testID="screenChild">Screen content</Text>
        </ScreenContainer>,
      );

      expect(getByTestId("screenChild")).toHaveTextContent(
        "Screen content",
      );
    });
  });

  describe("header", () => {
    it("renders header by default", () => {
      const { getByTestId } = render(
        <ScreenContainer headerTitle="Home">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(getByTestId("mockHeader")).toBeTruthy();
    });

    it("does not render header when disabled", () => {
      const { queryByTestId } = render(
        <ScreenContainer withHeader={false}>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(queryByTestId("mockHeader")).toBeNull();
    });

    it("passes header configuration", () => {
      const { getByTestId } = render(
        <ScreenContainer
          headerTitle="Packages"
          showBackButton={false}
          showLogout
          headerVariant="neutral"
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(getByTestId("mockHeader")).toHaveProp(
        "accessibilityLabel",
        "Packages|false|true|neutral",
      );
    });

    it("uses brand header variant by default", () => {
      const { getByTestId } = render(
        <ScreenContainer headerTitle="Packages">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(getByTestId("mockHeader")).toHaveProp(
        "accessibilityLabel",
        "Packages|true|false|brand",
      );
    });

    it("stores measured header height", () => {
      const { getByTestId } = render(
        <ScreenContainer headerTitle="Packages">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      fireEvent(getByTestId("mockHeader"), "layout", {
        nativeEvent: {
          layout: {
            x: 0,
            y: 0,
            width: 390,
            height: 104,
          },
        },
      });

      expect(mockSetHeaderHeight).toHaveBeenCalledWith(104);
    });

    it("does not update header height again when measured height is unchanged", () => {
      const { getByTestId } = render(
        <ScreenContainer headerTitle="Packages">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const header = getByTestId("mockHeader");

      const event = {
        nativeEvent: {
          layout: {
            x: 0,
            y: 0,
            width: 390,
            height: 104,
          },
        },
      };

      fireEvent(header, "layout", event);

      fireEvent(header, "layout", event);

      expect(mockSetHeaderHeight).toHaveBeenCalledTimes(1);
    });
  });

  describe("safe area", () => {
    it("disables safe area by default", () => {
      const { getByTestId, queryByTestId } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerUnsafeArea"),
      ).toBeTruthy();

      expect(
        queryByTestId("screenContainerSafeArea"),
      ).toBeNull();
    });

    it("enables safe area when withSafeArea is true", () => {
      const { getByTestId, queryByTestId } = render(
        <ScreenContainer withSafeArea>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerSafeArea"),
      ).toBeTruthy();

      expect(
        queryByTestId("screenContainerUnsafeArea"),
      ).toBeNull();
    });

    it("uses bottom safe-area edge by default when withSafeArea is true", () => {
      const { getByTestId } = render(
        <ScreenContainer withSafeArea>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerSafeArea"),
      ).toHaveProp("edges", ["bottom"]);
    });

    it("accepts custom safe-area edges when withSafeArea is true", () => {
      const { getByTestId } = render(
        <ScreenContainer
          withSafeArea
          safeAreaEdges={["top", "bottom"]}
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerSafeArea"),
      ).toHaveProp("edges", ["top", "bottom"]);
    });

    it("can explicitly disable safe area", () => {
      const { getByTestId, queryByTestId } = render(
        <ScreenContainer withSafeArea={false}>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerUnsafeArea"),
      ).toBeTruthy();

      expect(
        queryByTestId("screenContainerSafeArea"),
      ).toBeNull();
    });
  });

  describe("scroll", () => {
    it("does not render ScrollView by default", () => {
      const { queryByTestId, getByTestId } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        queryByTestId("screenContainerScrollView"),
      ).toBeNull();

      expect(
        getByTestId("screenContainerContent"),
      ).toBeTruthy();
    });

    it("renders ScrollView when scrollable", () => {
      const { getByTestId, queryByTestId } = render(
        <ScreenContainer scrollable>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerScrollView"),
      ).toBeTruthy();

      expect(
        queryByTestId("screenContainerContent"),
      ).toBeNull();
    });

    it("hides vertical scroll indicator by default", () => {
      const { getByTestId } = render(
        <ScreenContainer scrollable>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerScrollView"),
      ).toHaveProp("showsVerticalScrollIndicator", false);
    });

    it("shows vertical scroll indicator when enabled", () => {
      const { getByTestId } = render(
        <ScreenContainer scrollable showVerticalScroll>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerScrollView"),
      ).toHaveProp("showsVerticalScrollIndicator", true);
    });

    it("uses handled keyboard taps on ScrollView", () => {
      const { getByTestId } = render(
        <ScreenContainer scrollable>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerScrollView"),
      ).toHaveProp("keyboardShouldPersistTaps", "handled");
    });

    it("uses the expected keyboard dismiss mode", () => {
      const { getByTestId } = render(
        <ScreenContainer scrollable>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerScrollView"),
      ).toHaveProp(
        "keyboardDismissMode",
        Platform.OS === "ios" ? "interactive" : "on-drag",
      );
    });
  });

  describe("background", () => {
    it("uses neutral50 background by default", () => {
      const { getByTestId } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerRoot"),
      ).toHaveStyle({
        backgroundColor:
          lightTheme.colors.background.default,
      });

      expect(
        getByTestId("screenContainerUnsafeArea"),
      ).toHaveStyle({
        backgroundColor:
          lightTheme.colors.background.default,
      });
    });

    it("uses neutral100 background when requested", () => {
      const { getByTestId } = render(
        <ScreenContainer backgroundColorVariant="neutral100">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerRoot"),
      ).toHaveStyle({
        backgroundColor:
          lightTheme.colors.background.subtle,
      });

      expect(
        getByTestId("screenContainerUnsafeArea"),
      ).toHaveStyle({
        backgroundColor:
          lightTheme.colors.background.subtle,
      });
    });

    it("uses primary600 background when requested", () => {
      const { getByTestId } = render(
        <ScreenContainer backgroundColorVariant="primary600">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerRoot"),
      ).toHaveStyle({
        backgroundColor: lightTheme.colors.background.brand,
      });

      expect(
        getByTestId("screenContainerUnsafeArea"),
      ).toHaveStyle({
        backgroundColor: lightTheme.colors.background.brand,
      });
    });

    it("applies background to safe area when withSafeArea is true", () => {
      const { getByTestId } = render(
        <ScreenContainer
          withSafeArea
          backgroundColorVariant="primary600"
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerSafeArea"),
      ).toHaveStyle({
        backgroundColor: lightTheme.colors.background.brand,
      });
    });
  });

  describe("status bar", () => {
    it("renders status bar by default", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { StatusBar } =
        jest.requireActual("react-native");

      expect(UNSAFE_getByType(StatusBar)).toBeTruthy();
    });

    it("does not render status bar when disabled", () => {
      const { UNSAFE_queryByType } = render(
        <ScreenContainer withStatusBar={false}>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { StatusBar } =
        jest.requireActual("react-native");

      expect(UNSAFE_queryByType(StatusBar)).toBeNull();
    });

    it("uses primary status bar background for brand header by default", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { StatusBar } =
        jest.requireActual("react-native");

      const statusBar = UNSAFE_getByType(StatusBar);

      expect(statusBar.props.backgroundColor).toBe(
        lightTheme.colors.background.brand,
      );
    });

    it("uses screen background for neutral header status bar", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer
          headerVariant="neutral"
          backgroundColorVariant="neutral100"
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { StatusBar } =
        jest.requireActual("react-native");

      const statusBar = UNSAFE_getByType(StatusBar);

      expect(statusBar.props.backgroundColor).toBe(
        lightTheme.colors.background.subtle,
      );
    });

    it("allows custom status bar color", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer statusBarColor="#123456">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { StatusBar } =
        jest.requireActual("react-native");

      const statusBar = UNSAFE_getByType(StatusBar);

      expect(statusBar.props.backgroundColor).toBe(
        "#123456",
      );
    });

    it("uses dark-content status bar style by default", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { StatusBar } =
        jest.requireActual("react-native");

      const statusBar = UNSAFE_getByType(StatusBar);

      expect(statusBar.props.barStyle).toBe("dark-content");
    });

    it("allows custom status bar style", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer statusBarStyle="light-content">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { StatusBar } =
        jest.requireActual("react-native");

      const statusBar = UNSAFE_getByType(StatusBar);

      expect(statusBar.props.barStyle).toBe(
        "light-content",
      );
    });

    it("keeps status bar non-translucent", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { StatusBar } =
        jest.requireActual("react-native");

      const statusBar = UNSAFE_getByType(StatusBar);

      expect(statusBar.props.translucent).toBe(false);
    });
  });

  describe("gradient", () => {
    it("does not render gradient by default", () => {
      const { queryByTestId } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        queryByTestId("screenContainerGradient"),
      ).toBeNull();
    });

    it("renders gradient when enabled", () => {
      const { getByTestId } = render(
        <ScreenContainer withGradientBackground>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerGradient"),
      ).toBeTruthy();
    });

    it("uses the configured gradient colors", () => {
      const { getByTestId } = render(
        <ScreenContainer withGradientBackground>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerGradient"),
      ).toHaveProp("colors", [
        lightTheme.colors.background.brand,
        "transparent",
      ]);
    });

    it("does not intercept pointer events", () => {
      const { getByTestId } = render(
        <ScreenContainer withGradientBackground>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerGradient"),
      ).toHaveProp("pointerEvents", "none");
    });
  });

  describe("custom styles", () => {
    it("applies custom container styles with safe area", () => {
      const { getByTestId } = render(
        <ScreenContainer
          withSafeArea
          style={{
            paddingTop: 20,
          }}
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerSafeArea"),
      ).toHaveStyle({
        paddingTop: 20,
      });
    });

    it("applies custom content styles", () => {
      const { getByTestId } = render(
        <ScreenContainer
          contentContainerStyle={{
            paddingHorizontal: 24,
          }}
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerContent"),
      ).toHaveStyle({
        paddingHorizontal: 24,
      });
    });

    it("applies custom content styles to ScrollView", () => {
      const { getByTestId } = render(
        <ScreenContainer
          scrollable
          contentContainerStyle={{
            paddingHorizontal: 24,
          }}
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerScrollView"),
      ).toHaveProp(
        "contentContainerStyle",
        expect.arrayContaining([
          expect.objectContaining({
            paddingHorizontal: 24,
          }),
        ]),
      );
    });

    it("applies custom container styles without safe area", () => {
      const { getByTestId } = render(
        <ScreenContainer
          withSafeArea={false}
          style={{
            paddingTop: 20,
          }}
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerUnsafeArea"),
      ).toHaveStyle({
        paddingTop: 20,
      });
    });
  });

  describe("keyboard", () => {
    it("renders the keyboard avoiding container", () => {
      const { getByTestId } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerKeyboardAvoiding"),
      ).toBeTruthy();
    });

    it("is disabled by default", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { KeyboardAvoidingView } =
        jest.requireActual("react-native");

      const keyboardAvoidingView = UNSAFE_getByType(
        KeyboardAvoidingView,
      );

      expect(keyboardAvoidingView.props.enabled).toBe(
        false,
      );
    });

    it("can enable keyboard avoiding behavior", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer withKeyboardAvoiding>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { KeyboardAvoidingView } =
        jest.requireActual("react-native");

      const keyboardAvoidingView = UNSAFE_getByType(
        KeyboardAvoidingView,
      );

      expect(keyboardAvoidingView.props.enabled).toBe(true);
    });

    it("starts with zero keyboard offset before header is measured", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer withKeyboardAvoiding>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { KeyboardAvoidingView } =
        jest.requireActual("react-native");

      const keyboardAvoidingView = UNSAFE_getByType(
        KeyboardAvoidingView,
      );

      expect(
        keyboardAvoidingView.props.keyboardVerticalOffset,
      ).toBe(0);
    });

    it("uses measured header height as keyboard offset", () => {
      const { getByTestId, UNSAFE_getByType } = render(
        <ScreenContainer withKeyboardAvoiding>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      fireEvent(getByTestId("mockHeader"), "layout", {
        nativeEvent: {
          layout: {
            x: 0,
            y: 0,
            width: 390,
            height: 104,
          },
        },
      });

      const { KeyboardAvoidingView } =
        jest.requireActual("react-native");

      const keyboardAvoidingView = UNSAFE_getByType(
        KeyboardAvoidingView,
      );

      expect(
        keyboardAvoidingView.props.keyboardVerticalOffset,
      ).toBe(104);
    });

    it("keeps keyboard offset at zero when header is disabled", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer
          withHeader={false}
          withKeyboardAvoiding
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { KeyboardAvoidingView } =
        jest.requireActual("react-native");

      const keyboardAvoidingView = UNSAFE_getByType(
        KeyboardAvoidingView,
      );

      expect(
        keyboardAvoidingView.props.keyboardVerticalOffset,
      ).toBe(0);
    });

    it("uses padding behavior on iOS", () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer withKeyboardAvoiding>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      const { KeyboardAvoidingView, Platform } =
        jest.requireActual("react-native");

      const keyboardAvoidingView = UNSAFE_getByType(
        KeyboardAvoidingView,
      );

      expect(keyboardAvoidingView.props.behavior).toBe(
        Platform.OS === "ios" ? "padding" : undefined,
      );
    });
  });
});
