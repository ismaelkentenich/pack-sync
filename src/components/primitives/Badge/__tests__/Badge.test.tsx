import { render } from "@testing-library/react-native";
import Theme from "@theme/theme";
import { Badge } from "../Badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <Badge label="Collected" variant="status" />,
      );

      expect(getByTestId("badgeRoot")).toBeTruthy();
    });

    it("renders the label", () => {
      const { getByTestId } = render(
        <Badge label="Collected" variant="status" />,
      );

      expect(getByTestId("badgeText")).toHaveTextContent(
        "Collected",
      );
    });

    it("uses a custom testID when provided", () => {
      const { getByTestId, queryByTestId } = render(
        <Badge
          label="Collected"
          variant="status"
          testID="packageStatusBadge"
        />,
      );

      expect(
        getByTestId("packageStatusBadge"),
      ).toBeTruthy();

      expect(queryByTestId("badgeRoot")).toBeNull();
    });
  });

  describe("variants", () => {
    it("applies status colors", () => {
      const { getByTestId } = render(
        <Badge label="Collected" variant="status" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: Theme.colors.primary[200],
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        color: Theme.colors.primary[900],
      });
    });

    it("applies delivery colors", () => {
      const { getByTestId } = render(
        <Badge label="Pending" variant="delivery" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: Theme.colors.secondary[200],
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        color: Theme.colors.secondary[900],
      });
    });
  });

  describe("custom styles", () => {
    it("applies custom container styles", () => {
      const { getByTestId } = render(
        <Badge
          label="Collected"
          variant="status"
          style={{
            marginTop: 20,
          }}
        />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        marginTop: 20,
      });
    });

    it("applies custom text styles", () => {
      const { getByTestId } = render(
        <Badge
          label="Collected"
          variant="status"
          textStyle={{
            letterSpacing: 2,
          }}
        />,
      );

      expect(getByTestId("badgeText")).toHaveStyle({
        letterSpacing: 2,
      });
    });
  });
});
