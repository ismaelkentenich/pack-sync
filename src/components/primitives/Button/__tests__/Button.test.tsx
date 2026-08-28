import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { lightTheme } from "@theme/appTheme";
import { Button } from "../Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders the button with the default testID", () => {
      const { getByTestId } = render(
        <Button title="Continue" />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toBeTruthy();
    });

    it("renders the title", () => {
      const { getByTestId } = render(
        <Button title="Continue" />,
      );

      expect(getByTestId("buttonText")).toHaveTextContent(
        "Continue",
      );
    });

    it("uses a custom testID when provided", () => {
      const { getByTestId, queryByTestId } = render(
        <Button title="Continue" testID="continueButton" />,
      );

      expect(getByTestId("continueButton")).toBeTruthy();

      expect(
        queryByTestId("buttonTouchableOpacity"),
      ).toBeNull();
    });
  });

  describe("interaction", () => {
    it("calls onPress when pressed", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <Button title="Continue" onPress={onPress} />,
      );

      fireEvent.press(
        getByTestId("buttonTouchableOpacity"),
      );

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <Button
          title="Continue"
          onPress={onPress}
          disabled
        />,
      );

      fireEvent.press(
        getByTestId("buttonTouchableOpacity"),
      );

      expect(onPress).not.toHaveBeenCalled();
    });

    it("does not call onPress while loading", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <Button
          title="Continue"
          onPress={onPress}
          loading
        />,
      );

      fireEvent.press(
        getByTestId("buttonTouchableOpacity"),
      );

      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe("loading", () => {
    it("renders the loading indicator while loading", () => {
      const { getByTestId } = render(
        <Button title="Continue" loading />,
      );

      expect(
        getByTestId("buttonActivityIndicator"),
      ).toBeTruthy();
    });

    it("does not render the text while loading", () => {
      const { queryByTestId } = render(
        <Button title="Continue" loading />,
      );

      expect(queryByTestId("buttonText")).toBeNull();
    });

    it("renders the text when not loading", () => {
      const { getByTestId, queryByTestId } = render(
        <Button title="Continue" />,
      );

      expect(getByTestId("buttonText")).toBeTruthy();

      expect(
        queryByTestId("buttonActivityIndicator"),
      ).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("has button accessibility role", () => {
      const { getByTestId } = render(
        <Button title="Continue" />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveProp("accessibilityRole", "button");
    });

    it("exposes enabled accessibility state by default", () => {
      const { getByTestId } = render(
        <Button title="Continue" />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveProp("accessibilityState", {
        disabled: false,
        busy: false,
      });
    });

    it("exposes disabled accessibility state", () => {
      const { getByTestId } = render(
        <Button title="Continue" disabled />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveProp("accessibilityState", {
        disabled: true,
        busy: false,
      });
    });

    it("exposes busy and disabled states while loading", () => {
      const { getByTestId } = render(
        <Button title="Continue" loading />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveProp("accessibilityState", {
        disabled: true,
        busy: true,
      });
    });
  });

  describe("variants", () => {
    it.each([
      [
        "primary",
        lightTheme.colors.action.primary.background,
        lightTheme.colors.action.primary.background,
        lightTheme.colors.action.primary.foreground,
      ],
      [
        "brand",
        lightTheme.colors.action.brand.background,
        lightTheme.colors.action.brand.background,
        lightTheme.colors.action.brand.foreground,
      ],
      [
        "accent",
        lightTheme.colors.action.accent.background,
        lightTheme.colors.action.accent.background,
        lightTheme.colors.action.accent.foreground,
      ],
      [
        "secondary",
        lightTheme.colors.action.secondary.background,
        lightTheme.colors.action.secondary.background,
        lightTheme.colors.action.secondary.foreground,
      ],
      [
        "outline",
        "transparent",
        lightTheme.colors.border.strong,
        lightTheme.colors.text.primary,
      ],
      [
        "danger",
        lightTheme.colors.action.danger.background,
        lightTheme.colors.action.danger.background,
        lightTheme.colors.action.danger.foreground,
      ],
    ] as const)(
      "applies the expected styles for %s",
      (
        variant,
        backgroundColor,
        borderColor,
        textColor,
      ) => {
        const { getByTestId } = render(
          <Button title="Button" variant={variant} />,
        );

        expect(
          getByTestId("buttonTouchableOpacity"),
        ).toHaveStyle({
          backgroundColor,
          borderColor,
        });

        expect(getByTestId("buttonText")).toHaveStyle({
          color: textColor,
        });
      },
    );

    it("uses primary as the default variant", () => {
      const { getByTestId } = render(
        <Button title="Button" />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveStyle({
        backgroundColor:
          lightTheme.colors.action.primary.background,
        borderColor:
          lightTheme.colors.action.primary.background,
      });

      expect(getByTestId("buttonText")).toHaveStyle({
        color: lightTheme.colors.action.primary.foreground,
      });
    });
  });

  describe("sizes", () => {
    it.each([
      [
        "sm",
        lightTheme.sizing.control.sm,
        lightTheme.typography.size.sm,
        lightTheme.typography.lineHeight.sm,
      ],
      [
        "md",
        lightTheme.sizing.control.md,
        lightTheme.typography.size.md,
        lightTheme.typography.lineHeight.md,
      ],
      [
        "lg",
        lightTheme.sizing.control.lg,
        lightTheme.typography.size.lg,
        lightTheme.typography.lineHeight.lg,
      ],
    ] as const)(
      "applies the expected styles for size %s",
      (size, height, fontSize, lineHeight) => {
        const { getByTestId } = render(
          <Button title="Button" size={size} />,
        );

        expect(
          getByTestId("buttonTouchableOpacity"),
        ).toHaveStyle({
          height,
        });

        expect(getByTestId("buttonText")).toHaveStyle({
          fontSize,
          lineHeight,
        });
      },
    );

    it("uses md as the default size", () => {
      const { getByTestId } = render(
        <Button title="Button" />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveStyle({
        height: lightTheme.sizing.control.md,
      });

      expect(getByTestId("buttonText")).toHaveStyle({
        fontSize: lightTheme.typography.size.md,
        lineHeight: lightTheme.typography.lineHeight.md,
      });
    });
  });

  describe("disabled state", () => {
    it("applies disabled colors when disabled", () => {
      const { getByTestId } = render(
        <Button title="Button" disabled />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveStyle({
        backgroundColor:
          lightTheme.colors.action.disabled.background,
        borderColor:
          lightTheme.colors.action.disabled.background,
      });

      expect(getByTestId("buttonText")).toHaveStyle({
        color: lightTheme.colors.action.disabled.foreground,
      });
    });

    it("applies disabled colors regardless of variant", () => {
      const { getByTestId } = render(
        <Button title="Delete" variant="danger" disabled />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveStyle({
        backgroundColor:
          lightTheme.colors.action.disabled.background,
        borderColor:
          lightTheme.colors.action.disabled.background,
      });

      expect(getByTestId("buttonText")).toHaveStyle({
        color: lightTheme.colors.action.disabled.foreground,
      });
    });

    it("uses disabled color for the loading indicator", () => {
      const { getByTestId } = render(
        <Button title="Continue" variant="brand" loading />,
      );

      expect(
        getByTestId("buttonActivityIndicator"),
      ).toHaveProp(
        "color",
        lightTheme.colors.action.disabled.foreground,
      );
    });
  });

  describe("custom styles", () => {
    it("applies custom button styles", () => {
      const { getByTestId } = render(
        <Button
          title="Button"
          style={{
            width: 200,
          }}
        />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveStyle({
        width: 200,
      });
    });

    it("applies custom text styles", () => {
      const { getByTestId } = render(
        <Button
          title="Button"
          textStyle={{
            letterSpacing: 2,
          }}
        />,
      );

      expect(getByTestId("buttonText")).toHaveStyle({
        letterSpacing: 2,
      });
    });
  });
});
