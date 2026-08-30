import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { PackageSearch } from "lucide-react-native";
import { HomeActionCard } from "../HomeActionCard";

describe("HomeActionCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("secondary", () => {
    it("renders the card", () => {
      const { getByTestId } = render(
        <HomeActionCard
          testID="testCard"
          icon={PackageSearch}
          title="Packages"
          description="View your packages"
          onPress={jest.fn()}
        />,
      );

      expect(getByTestId("testCard")).toBeTruthy();
    });

    it("renders title", () => {
      const { getByTestId } = render(
        <HomeActionCard
          testID="testCard"
          icon={PackageSearch}
          title="Packages"
          description="View your packages"
          onPress={jest.fn()}
        />,
      );

      expect(
        getByTestId("testCardTitle"),
      ).toHaveTextContent("Packages");
    });

    it("renders description", () => {
      const { getByTestId } = render(
        <HomeActionCard
          testID="testCard"
          icon={PackageSearch}
          title="Packages"
          description="View your packages"
          onPress={jest.fn()}
        />,
      );

      expect(
        getByTestId("testCardDescription"),
      ).toHaveTextContent("View your packages");
    });

    it("renders the icon", () => {
      const { getAllByTestId } = render(
        <HomeActionCard
          testID="testCard"
          icon={PackageSearch}
          title="Packages"
          description="View your packages"
          onPress={jest.fn()}
        />,
      );

      expect(
        getAllByTestId("testCardIcon").length,
      ).toBeGreaterThan(0);
    });

    it("calls onPress", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <HomeActionCard
          testID="testCard"
          icon={PackageSearch}
          title="Packages"
          description="View your packages"
          onPress={onPress}
        />,
      );

      fireEvent.press(getByTestId("testCard"));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not render hero action", () => {
      const { queryByTestId } = render(
        <HomeActionCard
          testID="testCard"
          icon={PackageSearch}
          title="Packages"
          description="View your packages"
          onPress={jest.fn()}
        />,
      );

      expect(queryByTestId("testCardAction")).toBeNull();
    });
  });

  describe("hero", () => {
    it("renders hero content", () => {
      const { getByTestId } = render(
        <HomeActionCard
          testID="scannerCard"
          icon={PackageSearch}
          variant="hero"
          title="Scan package"
          description="Scan a package"
          actionLabel="Get started"
          onPress={jest.fn()}
        />,
      );

      expect(getByTestId("scannerCard")).toBeTruthy();

      expect(
        getByTestId("scannerCardTitle"),
      ).toHaveTextContent("Scan package");

      expect(
        getByTestId("scannerCardDescription"),
      ).toHaveTextContent("Scan a package");
    });

    it("renders hero action", () => {
      const { getByTestId } = render(
        <HomeActionCard
          testID="scannerCard"
          icon={PackageSearch}
          variant="hero"
          title="Scan package"
          description="Scan a package"
          actionLabel="Get started"
          onPress={jest.fn()}
        />,
      );

      expect(getByTestId("scannerCardAction")).toBeTruthy();

      expect(
        getByTestId("scannerCardActionText"),
      ).toHaveTextContent("Get started");
    });

    it("does not render action when actionLabel is absent", () => {
      const { queryByTestId } = render(
        <HomeActionCard
          testID="scannerCard"
          icon={PackageSearch}
          variant="hero"
          title="Scan package"
          description="Scan a package"
          onPress={jest.fn()}
        />,
      );

      expect(queryByTestId("scannerCardAction")).toBeNull();
    });

    it("calls onPress from hero card", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <HomeActionCard
          testID="scannerCard"
          icon={PackageSearch}
          variant="hero"
          title="Scan package"
          description="Scan a package"
          actionLabel="Get started"
          onPress={onPress}
        />,
      );

      fireEvent.press(getByTestId("scannerCard"));

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});
