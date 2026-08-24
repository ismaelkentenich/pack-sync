import { render } from "@testing-library/react-native";
import Theme from "@theme/theme";
import { Badge } from "../Badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <Badge label="Collected" />,
      );

      expect(getByTestId("badgeRoot")).toBeTruthy();
    });

    it("renders the label", () => {
      const { getByTestId } = render(
        <Badge label="Collected" />,
      );

      expect(getByTestId("badgeText")).toHaveTextContent(
        "Collected",
      );
    });

    it("uses a custom testID when provided", () => {
      const { getByTestId, queryByTestId } = render(
        <Badge
          label="Collected"
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
    it("uses neutral variant by default", () => {
      const { getByTestId } = render(
        <Badge label="Default" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: Theme.colors.neutral[200],
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        color: Theme.colors.neutral[800],
      });
    });

    it("applies primary colors", () => {
      const { getByTestId } = render(
        <Badge label="Primary" variant="primary" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: Theme.colors.primary[200],
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        color: Theme.colors.primary[900],
      });
    });

    it("applies secondary colors", () => {
      const { getByTestId } = render(
        <Badge label="Secondary" variant="secondary" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: Theme.colors.secondary[200],
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        color: Theme.colors.secondary[900],
      });
    });

    it("applies success colors", () => {
      const { getByTestId } = render(
        <Badge label="Success" variant="success" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: Theme.colors.success[50],
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        color: Theme.colors.success[700],
      });
    });

    it("applies warning colors", () => {
      const { getByTestId } = render(
        <Badge label="Warning" variant="warning" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: Theme.colors.warning[50],
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        color: Theme.colors.warning[700],
      });
    });

    it("applies error colors", () => {
      const { getByTestId } = render(
        <Badge label="Error" variant="error" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: Theme.colors.error[50],
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        color: Theme.colors.error[700],
      });
    });
  });

  describe("sizes", () => {
    it("uses medium size by default", () => {
      const { getByTestId } = render(
        <Badge label="Medium" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: Theme.spacing.xxs,
        borderRadius: Theme.radius.sm,
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        fontSize: Theme.typography.size.sm,
        lineHeight: Theme.typography.lineHeight.sm,
      });
    });

    it("applies small size styles", () => {
      const { getByTestId } = render(
        <Badge label="Small" size="sm" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        paddingHorizontal: Theme.spacing.xs,
        paddingVertical: Theme.spacing.xxs,
        borderRadius: Theme.radius.xs,
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        fontSize: Theme.typography.size.xs,
        lineHeight: Theme.typography.lineHeight.xs,
      });
    });

    it("applies large size styles", () => {
      const { getByTestId } = render(
        <Badge label="Large" size="lg" />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.xs,
        borderRadius: Theme.radius.md,
      });

      expect(getByTestId("badgeText")).toHaveStyle({
        fontSize: Theme.typography.size.md,
        lineHeight: Theme.typography.lineHeight.md,
      });
    });
  });

  describe("custom styles", () => {
    it("applies custom container styles", () => {
      const { getByTestId } = render(
        <Badge
          label="Collected"
          variant="primary"
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
          variant="primary"
          textStyle={{
            letterSpacing: 2,
          }}
        />,
      );

      expect(getByTestId("badgeText")).toHaveStyle({
        letterSpacing: 2,
      });
    });

    it("allows custom container styles to override variant styles", () => {
      const { getByTestId } = render(
        <Badge
          label="Custom"
          variant="primary"
          style={{
            backgroundColor: "#123456",
          }}
        />,
      );

      expect(getByTestId("badgeRoot")).toHaveStyle({
        backgroundColor: "#123456",
      });
    });

    it("allows custom text styles to override variant styles", () => {
      const { getByTestId } = render(
        <Badge
          label="Custom"
          variant="primary"
          textStyle={{
            color: "#654321",
          }}
        />,
      );

      expect(getByTestId("badgeText")).toHaveStyle({
        color: "#654321",
      });
    });
  });
});
