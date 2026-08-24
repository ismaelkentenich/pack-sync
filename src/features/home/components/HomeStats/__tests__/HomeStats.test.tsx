import { render } from "@testing-library/react-native";
import Theme from "@theme/theme";
import { HomeStats } from "../HomeStats";

describe("HomeStats", () => {
  describe("rendering", () => {
    it("renders the container", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
            },
          ]}
        />,
      );

      expect(getByTestId("homeStats")).toBeTruthy();
    });

    it("renders all items", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
            },
            {
              label: "Pending",
              value: 3,
              variant: "warning",
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toBeTruthy();
      expect(getByTestId("homeStatCard-1")).toBeTruthy();
    });

    it("renders item values", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
            },
          ]}
        />,
      );

      expect(
        getByTestId("homeStatValue-0"),
      ).toHaveTextContent("12");
    });

    it("renders item labels", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
            },
          ]}
        />,
      );

      expect(
        getByTestId("homeStatLabel-0"),
      ).toHaveTextContent("Packages");
    });

    it("renders zero values", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Pending",
              value: 0,
              variant: "success",
            },
          ]}
        />,
      );

      expect(
        getByTestId("homeStatValue-0"),
      ).toHaveTextContent("0");
    });
  });

  describe("variants", () => {
    it("uses neutral colors by default", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toHaveStyle({
        backgroundColor: Theme.colors.primary[600],
        borderColor: Theme.colors.neutral[200],
      });

      expect(getByTestId("homeStatValue-0")).toHaveStyle({
        color: Theme.colors.neutral[100],
      });

      expect(getByTestId("homeStatLabel-0")).toHaveStyle({
        color: Theme.colors.neutral[100],
      });
    });

    it("applies neutral colors", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
              variant: "neutral",
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toHaveStyle({
        backgroundColor: Theme.colors.primary[600],
        borderColor: Theme.colors.neutral[200],
      });

      expect(getByTestId("homeStatValue-0")).toHaveStyle({
        color: Theme.colors.neutral[100],
      });

      expect(getByTestId("homeStatLabel-0")).toHaveStyle({
        color: Theme.colors.neutral[100],
      });
    });

    it("applies success colors", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Pending",
              value: 0,
              variant: "success",
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toHaveStyle({
        backgroundColor: Theme.colors.success[500],
        borderColor: Theme.colors.success[500],
      });

      expect(getByTestId("homeStatValue-0")).toHaveStyle({
        color: Theme.colors.neutral[100],
      });

      expect(getByTestId("homeStatLabel-0")).toHaveStyle({
        color: Theme.colors.neutral[100],
      });
    });

    it("applies warning colors", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Pending",
              value: 3,
              variant: "warning",
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toHaveStyle({
        backgroundColor: Theme.colors.secondary[500],
        borderColor: Theme.colors.secondary[500],
      });

      expect(getByTestId("homeStatValue-0")).toHaveStyle({
        color: Theme.colors.neutral[100],
      });

      expect(getByTestId("homeStatLabel-0")).toHaveStyle({
        color: Theme.colors.neutral[100],
      });
    });
  });

  describe("accessibility", () => {
    it("marks stat cards as accessible", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toHaveProp(
        "accessible",
        true,
      );
    });

    it("creates accessibility label from label and value", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Pending",
              value: 3,
              variant: "warning",
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toHaveProp(
        "accessibilityLabel",
        "Pending: 3",
      );
    });

    it("creates accessibility labels for each item", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
            },
            {
              label: "Pending",
              value: 3,
              variant: "warning",
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toHaveProp(
        "accessibilityLabel",
        "Packages: 12",
      );

      expect(getByTestId("homeStatCard-1")).toHaveProp(
        "accessibilityLabel",
        "Pending: 3",
      );
    });
  });

  describe("multiple items", () => {
    it("keeps each item styles independent", () => {
      const { getByTestId } = render(
        <HomeStats
          items={[
            {
              label: "Packages",
              value: 12,
              variant: "neutral",
            },
            {
              label: "Pending",
              value: 3,
              variant: "warning",
            },
            {
              label: "Synced",
              value: 9,
              variant: "success",
            },
          ]}
        />,
      );

      expect(getByTestId("homeStatCard-0")).toHaveStyle({
        backgroundColor: Theme.colors.primary[600],
      });

      expect(getByTestId("homeStatCard-1")).toHaveStyle({
        backgroundColor: Theme.colors.secondary[500],
      });

      expect(getByTestId("homeStatCard-2")).toHaveStyle({
        backgroundColor: Theme.colors.success[500],
      });
    });
  });

  describe("empty state", () => {
    it("renders the container without cards when items is empty", () => {
      const { getByTestId, queryByTestId } = render(
        <HomeStats items={[]} />,
      );

      expect(getByTestId("homeStats")).toBeTruthy();
      expect(queryByTestId("homeStatCard-0")).toBeNull();
    });
  });
});
