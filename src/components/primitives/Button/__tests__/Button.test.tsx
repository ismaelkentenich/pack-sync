import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import Theme from "@theme/theme";
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
        Theme.colors.neutral[900],
        Theme.colors.neutral[900],
        Theme.colors.neutral[0],
      ],
      [
        "brand",
        Theme.colors.primary[500],
        Theme.colors.primary[500],
        Theme.colors.neutral[0],
      ],
      [
        "accent",
        Theme.colors.secondary[400],
        Theme.colors.secondary[400],
        Theme.colors.neutral[900],
      ],
      [
        "secondary",
        Theme.colors.neutral[200],
        Theme.colors.neutral[200],
        Theme.colors.neutral[900],
      ],
      [
        "outline",
        "transparent",
        Theme.colors.neutral[900],
        Theme.colors.neutral[900],
      ],
      [
        "danger",
        Theme.colors.error[500],
        Theme.colors.error[500],
        Theme.colors.neutral[0],
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
        backgroundColor: Theme.colors.neutral[900],
        borderColor: Theme.colors.neutral[900],
      });

      expect(getByTestId("buttonText")).toHaveStyle({
        color: Theme.colors.neutral[0],
      });
    });
  });

  describe("sizes", () => {
    it.each([
      [
        "sm",
        Theme.sizing.control.sm,
        Theme.typography.size.sm,
        Theme.typography.lineHeight.sm,
      ],
      [
        "md",
        Theme.sizing.control.md,
        Theme.typography.size.md,
        Theme.typography.lineHeight.md,
      ],
      [
        "lg",
        Theme.sizing.control.lg,
        Theme.typography.size.lg,
        Theme.typography.lineHeight.lg,
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
        height: Theme.sizing.control.md,
      });

      expect(getByTestId("buttonText")).toHaveStyle({
        fontSize: Theme.typography.size.md,
        lineHeight: Theme.typography.lineHeight.md,
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
        backgroundColor: Theme.colors.neutral[300],
        borderColor: Theme.colors.neutral[300],
      });

      expect(getByTestId("buttonText")).toHaveStyle({
        color: Theme.colors.neutral[500],
      });
    });

    it("applies disabled colors regardless of variant", () => {
      const { getByTestId } = render(
        <Button title="Delete" variant="danger" disabled />,
      );

      expect(
        getByTestId("buttonTouchableOpacity"),
      ).toHaveStyle({
        backgroundColor: Theme.colors.neutral[300],
        borderColor: Theme.colors.neutral[300],
      });

      expect(getByTestId("buttonText")).toHaveStyle({
        color: Theme.colors.neutral[500],
      });
    });

    it("uses disabled color for the loading indicator", () => {
      const { getByTestId } = render(
        <Button title="Continue" variant="brand" loading />,
      );

      expect(
        getByTestId("buttonActivityIndicator"),
      ).toHaveProp("color", Theme.colors.neutral[500]);
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
