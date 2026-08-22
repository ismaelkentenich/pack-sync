import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { Text } from "react-native";
import { Card } from "../Card";

describe("Card", () => {
  describe("rendering", () => {
    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <Card>
          <Text>Content</Text>
        </Card>,
      );

      expect(getByTestId("cardRoot")).toBeTruthy();
    });

    it("uses a custom testID when provided", () => {
      const { getByTestId, queryByTestId } = render(
        <Card testID="packageCard">
          <Text>Content</Text>
        </Card>,
      );

      expect(getByTestId("packageCard")).toBeTruthy();
      expect(queryByTestId("cardRoot")).toBeNull();
    });

    it("renders children", () => {
      const { getByTestId } = render(
        <Card>
          <Text testID="cardChild">Card content</Text>
        </Card>,
      );

      expect(getByTestId("cardChild")).toHaveTextContent(
        "Card content",
      );
    });
  });

  describe("touchable", () => {
    it("calls onPress when touchable", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <Card onPress={onPress}>
          <Text>Content</Text>
        </Card>,
      );

      fireEvent.press(getByTestId("cardRoot"));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("uses button accessibility role when touchable", () => {
      const { getByTestId } = render(
        <Card>
          <Text>Content</Text>
        </Card>,
      );

      expect(getByTestId("cardRoot")).toHaveProp(
        "accessibilityRole",
        "button",
      );
    });

    it("exposes enabled accessibility state by default", () => {
      const { getByTestId } = render(
        <Card>
          <Text>Content</Text>
        </Card>,
      );

      expect(getByTestId("cardRoot")).toHaveProp(
        "accessibilityState",
        {
          disabled: false,
        },
      );
    });

    it("does not call onPress when disabled", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <Card onPress={onPress} disabled>
          <Text>Content</Text>
        </Card>,
      );

      fireEvent.press(getByTestId("cardRoot"));

      expect(onPress).not.toHaveBeenCalled();
    });

    it("exposes disabled accessibility state", () => {
      const { getByTestId } = render(
        <Card disabled>
          <Text>Content</Text>
        </Card>,
      );

      expect(getByTestId("cardRoot")).toHaveProp(
        "accessibilityState",
        {
          disabled: true,
        },
      );
    });
  });

  describe("non-touchable", () => {
    it("renders when touchable is false", () => {
      const { getByTestId } = render(
        <Card touchable={false}>
          <Text>Content</Text>
        </Card>,
      );

      expect(getByTestId("cardRoot")).toBeTruthy();
    });

    it("does not expose button accessibility role", () => {
      const { getByTestId } = render(
        <Card touchable={false}>
          <Text>Content</Text>
        </Card>,
      );

      expect(getByTestId("cardRoot")).not.toHaveProp(
        "accessibilityRole",
      );
    });

    it("does not expose onPress when touchable is false", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <Card touchable={false} onPress={onPress}>
          <Text>Content</Text>
        </Card>,
      );

      const card = getByTestId("cardRoot");

      expect(card).not.toHaveProp("onPress");
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe("custom styles", () => {
    it("applies custom styles", () => {
      const { getByTestId } = render(
        <Card
          style={{
            width: 220,
          }}
        >
          <Text>Content</Text>
        </Card>,
      );

      expect(getByTestId("cardRoot")).toHaveStyle({
        width: 220,
      });
    });
  });
});
