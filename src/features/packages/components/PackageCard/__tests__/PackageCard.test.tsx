import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { PackageCard } from "../PackageCard";
import type { Package } from "@features/packages/domain/package.types";

const mockPackage: Package = {
  id: "1",
  code: "PKG-001",
  status: PackageStatus.COLLECTED,
  deliveryStatus: DeliveryStatus.PENDING,
  clientCode: "user-1",
  scanned_at: "2026-08-22T14:30:00.000Z",
};

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,

    i18n: {
      language: "en",
      resolvedLanguage: "en",
    },
  }),
}));

jest.mock(
  "@features/packages/utils/packageTranslations",
  () => ({
    translatePackageStatus: jest.fn(
      (status: PackageStatus) => `status:${status}`,
    ),

    translateDeliveryStatus: jest.fn(
      (status: DeliveryStatus) => `delivery:${status}`,
    ),
  }),
);

jest.mock("@utils/date", () => ({
  formatDate: jest.fn(() => "Aug 22, 2026"),
}));

describe("PackageCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(getByTestId("packageCardRoot")).toBeTruthy();
    });

    it("uses a custom root testID", () => {
      const { getByTestId, queryByTestId } = render(
        <PackageCard
          item={mockPackage}
          testID="currentPackageCard"
        />,
      );

      expect(
        getByTestId("currentPackageCard"),
      ).toBeTruthy();

      expect(queryByTestId("packageCardRoot")).toBeNull();
    });

    it("renders the package code", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(
        getByTestId("packageCardCode"),
      ).toHaveTextContent("packages.code: PKG-001");
    });

    it("renders package info container", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(getByTestId("packageCardInfo")).toBeTruthy();
    });
  });

  describe("status", () => {
    it("renders package status label", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(
        getByTestId("packageCardStatusLabel"),
      ).toHaveTextContent("packages.packageStatus:");
    });

    it("renders translated package status", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(
        getByTestId("packageCardStatusBadge"),
      ).toHaveTextContent(
        `status:${PackageStatus.COLLECTED}`,
      );
    });
  });

  describe("delivery status", () => {
    it("renders delivery status label", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(
        getByTestId("packageCardDeliveryLabel"),
      ).toHaveTextContent("packages.deliveryStatusLabel:");
    });

    it("renders delivery status badge", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(
        getByTestId("packageCardDeliveryBadge"),
      ).toBeTruthy();
    });

    it("renders translated delivery status", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(
        getByTestId("packageCardDeliveryBadge"),
      ).toHaveTextContent(
        `delivery:${DeliveryStatus.PENDING}`,
      );
    });
  });

  describe("date", () => {
    it("renders formatted scan date", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(
        getByTestId("packageCardScannedAt"),
      ).toHaveTextContent(
        "packages.scannedAt: Aug 22, 2026",
      );
    });

    it("uses the resolved locale when formatting the date", () => {
      const { formatDate } = jest.requireMock(
        "@utils/date",
      ) as {
        formatDate: jest.Mock;
      };

      render(<PackageCard item={mockPackage} />);

      expect(formatDate).toHaveBeenCalledWith(
        mockPackage.scanned_at,
        "en",
      );
    });
  });

  describe("interaction", () => {
    it("calls onPress when card is pressed", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <PackageCard
          item={mockPackage}
          onPress={onPress}
        />,
      );

      fireEvent.press(getByTestId("packageCardRoot"));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not expose card onPress when actions are visible", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <PackageCard
          item={mockPackage}
          onPress={onPress}
          showButtons
        />,
      );

      expect(getByTestId("packageCardRoot")).not.toHaveProp(
        "onPress",
        onPress,
      );
    });

    it("does not expose onPress when card is non-pressable", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <PackageCard
          item={mockPackage}
          onPress={onPress}
          pressable={false}
        />,
      );

      expect(getByTestId("packageCardRoot")).not.toHaveProp(
        "onPress",
      );
    });
  });

  describe("actions", () => {
    it("does not render actions by default", () => {
      const { queryByTestId } = render(
        <PackageCard item={mockPackage} />,
      );

      expect(
        queryByTestId("packageCardActions"),
      ).toBeNull();

      expect(
        queryByTestId("packageCardDetailsButton"),
      ).toBeNull();

      expect(
        queryByTestId("packageCardUpdateButton"),
      ).toBeNull();
    });

    it("renders actions when showButtons is true", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} showButtons />,
      );

      expect(
        getByTestId("packageCardActions"),
      ).toBeTruthy();

      expect(
        getByTestId("packageCardDetailsButton"),
      ).toBeTruthy();

      expect(
        getByTestId("packageCardUpdateButton"),
      ).toBeTruthy();
    });

    it("calls onPress from details button", () => {
      const onPress = jest.fn();

      const { getByTestId } = render(
        <PackageCard
          item={mockPackage}
          showButtons
          onPress={onPress}
        />,
      );

      fireEvent.press(
        getByTestId("packageCardDetailsButton"),
      );

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("calls onPressUpdate from update button", () => {
      const onPressUpdate = jest.fn();

      const { getByTestId } = render(
        <PackageCard
          item={mockPackage}
          showButtons
          onPressUpdate={onPressUpdate}
        />,
      );

      fireEvent.press(
        getByTestId("packageCardUpdateButton"),
      );

      expect(onPressUpdate).toHaveBeenCalledTimes(1);
    });

    it("uses translated action labels", () => {
      const { getByTestId } = render(
        <PackageCard item={mockPackage} showButtons />,
      );

      expect(
        getByTestId("packageCardDetailsButton"),
      ).toBeTruthy();

      expect(
        getByTestId("packageCardUpdateButton"),
      ).toBeTruthy();
    });
  });

  describe("status combinations", () => {
    it("renders a delivered package", () => {
      const deliveredPackage: Package = {
        ...mockPackage,
        status: PackageStatus.DELIVERED,
        deliveryStatus: DeliveryStatus.SENT,
        receiverName: "John Doe",
      };

      const { getByTestId } = render(
        <PackageCard item={deliveredPackage} />,
      );

      expect(
        getByTestId("packageCardStatusBadge"),
      ).toBeTruthy();

      expect(
        getByTestId("packageCardDeliveryBadge"),
      ).toBeTruthy();
    });

    it("renders an out-for-delivery package", () => {
      const routePackage: Package = {
        ...mockPackage,
        status: PackageStatus.IN_DELIVERY,
      };

      const { getByTestId } = render(
        <PackageCard item={routePackage} />,
      );

      expect(
        getByTestId("packageCardStatusBadge"),
      ).toBeTruthy();
    });
  });
});
