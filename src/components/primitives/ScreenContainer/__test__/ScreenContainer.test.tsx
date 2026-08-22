import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import Theme from "@theme/theme";
import { ScreenContainer } from "../ScreenContainer";

jest.mock("@components/composites/Header", () => {
  const { Text } = jest.requireActual("react-native");

  function MockHeader({
    title,
    showBack,
    showLogout,
  }: {
    title?: string;
    showBack?: boolean;
    showLogout?: boolean;
  }) {
    return (
      <Text
        testID="mockHeader"
        accessibilityLabel={[
          title,
          String(showBack),
          String(showLogout),
        ].join("|")}
      >
        {title}
      </Text>
    );
  }

  return {
    Header: MockHeader,
  };
});

describe("ScreenContainer", () => {
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
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(getByTestId("mockHeader")).toHaveProp(
        "accessibilityLabel",
        "Packages|false|true",
      );
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
  });

  describe("background", () => {
    it("uses neutral50 background by default", () => {
      const { getByTestId } = render(
        <ScreenContainer>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerSafeArea"),
      ).toHaveStyle({
        backgroundColor: Theme.colors.neutral[50],
      });
    });

    it("uses neutral100 background when requested", () => {
      const { getByTestId } = render(
        <ScreenContainer backgroundColorVariant="neutral100">
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerSafeArea"),
      ).toHaveStyle({
        backgroundColor: Theme.colors.neutral[100],
      });
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

    it("offsets gradient by header height", () => {
      const { getByTestId } = render(
        <ScreenContainer withGradientBackground>
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerGradient"),
      ).toHaveStyle({
        top: Theme.sizing.control.lg,
      });
    });

    it("starts gradient at zero without header", () => {
      const { getByTestId } = render(
        <ScreenContainer
          withHeader={false}
          withGradientBackground
        >
          <Text>Content</Text>
        </ScreenContainer>,
      );

      expect(
        getByTestId("screenContainerGradient"),
      ).toHaveStyle({
        top: 0,
      });
    });
  });

  describe("custom styles", () => {
    it("applies custom container styles", () => {
      const { getByTestId } = render(
        <ScreenContainer
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
  });
});
