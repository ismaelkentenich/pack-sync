import {
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { UpdateStatusModal } from "../UpdateStatusModal";
import type { Package } from "@features/packages/domain/package.types";

const mockChangeStatus = jest.fn();
const mockLoadPackages = jest.fn();
const mockSendPackage = jest.fn();

const mockShowAlert = jest.fn();

let mockSyncingPackageIds: string[] = [];

const mockPackage: Package = {
  id: "1",
  code: "PKG-001",
  status: PackageStatus.COLLECTED,
  deliveryStatus: DeliveryStatus.PENDING,
  clientCode: "user-1",
  scanned_at: "2026-08-22T14:30:00.000Z",
};

jest.mock("@components/composites/ModalWrapper", () => {
  const React = jest.requireActual("react");

  const { Text, TouchableOpacity, View } =
    jest.requireActual("react-native");

  const MockModalWrapper = React.forwardRef(
    function MockModalWrapper(
      {
        children,
      }: {
        children: React.ReactNode;
      },
      _ref: React.ForwardedRef<unknown>,
    ) {
      return (
        <View testID="mockModalWrapper">{children}</View>
      );
    },
  );

  MockModalWrapper.displayName = "MockModalWrapper";

  function MockModalCloseIcon({
    onPress,
    testID,
    accessibilityLabel,
    accessibilityRole,
  }: {
    onPress: () => void;
    testID?: string;
    accessibilityLabel?: string;
    accessibilityRole?: "button";
  }) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
      >
        <Text>Close</Text>
      </TouchableOpacity>
    );
  }

  return {
    ModalWrapper: MockModalWrapper,
    ModalCloseIcon: MockModalCloseIcon,
  };
});

jest.mock("@react-native-picker/picker", () => {
  const React = jest.requireActual("react");

  const { Text, TouchableOpacity, View } =
    jest.requireActual("react-native");

  const { PackageStatus: MockPackageStatus } =
    jest.requireActual(
      "@features/packages/domain/package.enums",
    );

  function MockPicker({
    children,
    selectedValue,
    enabled,
    onValueChange,
    testID,
  }: {
    children: React.ReactNode;
    selectedValue?: string;
    enabled?: boolean;
    onValueChange?: (value: string) => void;
    testID?: string;
  }) {
    return (
      <View testID={testID}>
        <Text testID="mockPickerSelectedValue">
          {selectedValue}
        </Text>

        <Text testID="mockPickerEnabled">
          {String(enabled)}
        </Text>

        <TouchableOpacity
          testID="mockPickerSelectDelivered"
          disabled={enabled === false}
          onPress={() =>
            onValueChange?.(MockPackageStatus.DELIVERED)
          }
        >
          <Text>Delivered</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="mockPickerSelectRoute"
          disabled={enabled === false}
          onPress={() =>
            onValueChange?.(MockPackageStatus.IN_DELIVERY)
          }
        >
          <Text>Route</Text>
        </TouchableOpacity>

        {children}
      </View>
    );
  }

  function MockPickerItem({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) {
    return (
      <Text testID={`mockPickerItem-${value}`}>
        {label}
      </Text>
    );
  }

  MockPicker.Item = MockPickerItem;

  return {
    Picker: MockPicker,
  };
});

jest.mock(
  "@features/packages/store/usePackageStore",
  () => ({
    usePackageStore: (
      selector: (state: {
        changeStatus: typeof mockChangeStatus;
        loadPackages: typeof mockLoadPackages;
        sendPackage: typeof mockSendPackage;
        syncingPackageIds: string[];
      }) => unknown,
    ) =>
      selector({
        changeStatus: mockChangeStatus,
        loadPackages: mockLoadPackages,
        sendPackage: mockSendPackage,
        syncingPackageIds: mockSyncingPackageIds,
      }),
  }),
);

jest.mock("@store/useAlertStore", () => ({
  useShowAlert: (
    selector: (state: {
      show: typeof mockShowAlert;
    }) => unknown,
  ) =>
    selector({
      show: mockShowAlert,
    }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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

describe("UpdateStatusModal", () => {
  const defaultProps = {
    packageData: mockPackage,
    userId: "user-1",
    handleCloseModal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockSyncingPackageIds = [];

    mockChangeStatus.mockReturnValue({
      success: true,
    });

    mockSendPackage.mockResolvedValue({
      success: true,
    });
  });

  describe("rendering", () => {
    it("renders modal content", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("updateStatusModalContent"),
      ).toBeTruthy();
    });

    it("renders title", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("updateStatusModalTitle"),
      ).toHaveTextContent("packages.updateStatus.title");
    });

    it("renders package code", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("updateStatusModalPackageCode"),
      ).toHaveTextContent("PKG-001");
    });

    it("renders current package status", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("updateStatusModalCurrentStatusText"),
      ).toHaveTextContent(
        `status:${PackageStatus.COLLECTED}`,
      );
    });

    it("renders current delivery status", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("updateStatusModalDeliveryStatusText"),
      ).toHaveTextContent(
        `delivery:${DeliveryStatus.PENDING}`,
      );
    });

    it("renders all package status options", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId(
          `mockPickerItem-${PackageStatus.COLLECTED}`,
        ),
      ).toBeTruthy();

      expect(
        getByTestId(
          `mockPickerItem-${PackageStatus.IN_DELIVERY}`,
        ),
      ).toBeTruthy();

      expect(
        getByTestId(
          `mockPickerItem-${PackageStatus.DELIVERED}`,
        ),
      ).toBeTruthy();
    });
  });

  describe("close", () => {
    it("closes modal when close button is pressed", () => {
      const handleCloseModal = jest.fn();

      const { getByTestId } = render(
        <UpdateStatusModal
          {...defaultProps}
          handleCloseModal={handleCloseModal}
        />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalCloseButton"),
      );

      expect(handleCloseModal).toHaveBeenCalledTimes(1);
    });
  });

  describe("status selection", () => {
    it("starts with package current status", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("mockPickerSelectedValue"),
      ).toHaveTextContent(PackageStatus.COLLECTED);
    });

    it("does not show receiver input by default", () => {
      const { queryByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        queryByTestId("updateStatusModalReceiverInput"),
      ).toBeNull();
    });

    it("shows receiver input when delivered status is selected", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("mockPickerSelectDelivered"),
      );

      expect(
        getByTestId("updateStatusModalReceiverInput"),
      ).toBeTruthy();
    });

    it("hides receiver input again when a non-delivered status is selected", () => {
      const { getByTestId, queryByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("mockPickerSelectDelivered"),
      );

      expect(
        getByTestId("updateStatusModalReceiverInput"),
      ).toBeTruthy();

      fireEvent.press(getByTestId("mockPickerSelectRoute"));

      expect(
        queryByTestId("updateStatusModalReceiverInput"),
      ).toBeNull();
    });
  });

  describe("receiver validation", () => {
    it("blocks local update when delivered without receiver", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("mockPickerSelectDelivered"),
      );

      fireEvent.press(
        getByTestId("updateStatusModalUpdateButton"),
      );

      expect(mockShowAlert).toHaveBeenCalledWith(
        "packages.updateStatus.receiverRequired",
        "error",
      );

      expect(mockChangeStatus).not.toHaveBeenCalled();
    });

    it("blocks sync when delivered without receiver", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("mockPickerSelectDelivered"),
      );

      fireEvent.press(
        getByTestId("updateStatusModalSyncButton"),
      );

      expect(mockShowAlert).toHaveBeenCalledWith(
        "packages.updateStatus.receiverRequired",
        "error",
      );

      expect(mockChangeStatus).not.toHaveBeenCalled();

      expect(mockSendPackage).not.toHaveBeenCalled();
    });
  });

  describe("local update", () => {
    it("updates package status", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(getByTestId("mockPickerSelectRoute"));

      fireEvent.press(
        getByTestId("updateStatusModalUpdateButton"),
      );

      expect(mockChangeStatus).toHaveBeenCalledWith(
        "1",
        "user-1",
        PackageStatus.IN_DELIVERY,
        undefined,
      );
    });

    it("trims receiver name before updating", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("mockPickerSelectDelivered"),
      );

      fireEvent.changeText(
        getByTestId("updateStatusModalReceiverInput"),
        "  John Doe  ",
      );

      fireEvent.press(
        getByTestId("updateStatusModalUpdateButton"),
      );

      expect(mockChangeStatus).toHaveBeenCalledWith(
        "1",
        "user-1",
        PackageStatus.DELIVERED,
        "John Doe",
      );
    });

    it("reloads packages after successful update", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalUpdateButton"),
      );

      expect(mockLoadPackages).toHaveBeenCalledWith(
        "user-1",
      );
    });

    it("closes modal after successful update", () => {
      const handleCloseModal = jest.fn();

      const { getByTestId } = render(
        <UpdateStatusModal
          {...defaultProps}
          handleCloseModal={handleCloseModal}
        />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalUpdateButton"),
      );

      expect(handleCloseModal).toHaveBeenCalledTimes(1);
    });

    it("does not reload or close when changeStatus fails", () => {
      const handleCloseModal = jest.fn();

      mockChangeStatus.mockReturnValue({
        success: false,
      });

      const { getByTestId } = render(
        <UpdateStatusModal
          {...defaultProps}
          handleCloseModal={handleCloseModal}
        />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalUpdateButton"),
      );

      expect(mockLoadPackages).not.toHaveBeenCalled();

      expect(handleCloseModal).not.toHaveBeenCalled();
    });
  });

  describe("update and sync", () => {
    it("sends updated package data", async () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("mockPickerSelectDelivered"),
      );

      fireEvent.changeText(
        getByTestId("updateStatusModalReceiverInput"),
        "John Doe",
      );

      fireEvent.press(
        getByTestId("updateStatusModalSyncButton"),
      );

      await waitFor(() => {
        expect(mockSendPackage).toHaveBeenCalledTimes(1);
      });

      expect(mockSendPackage).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "1",
          code: "PKG-001",

          status: PackageStatus.DELIVERED,

          deliveryStatus: DeliveryStatus.PENDING,

          receiverName: "John Doe",

          sent_at: undefined,
        }),
        "user-1",
      );
    });

    it("reloads packages before synchronization", async () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalSyncButton"),
      );

      await waitFor(() => {
        expect(mockSendPackage).toHaveBeenCalled();
      });

      expect(mockLoadPackages).toHaveBeenCalledWith(
        "user-1",
      );
    });

    it("reloads packages after successful synchronization", async () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalSyncButton"),
      );

      await waitFor(() => {
        expect(mockSendPackage).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockLoadPackages).toHaveBeenCalledTimes(2);
      });
    });

    it("closes modal after successful synchronization", async () => {
      const handleCloseModal = jest.fn();

      const { getByTestId } = render(
        <UpdateStatusModal
          {...defaultProps}
          handleCloseModal={handleCloseModal}
        />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalSyncButton"),
      );

      await waitFor(() => {
        expect(handleCloseModal).toHaveBeenCalledTimes(1);
      });
    });

    it("does not close modal when synchronization fails", async () => {
      const handleCloseModal = jest.fn();

      mockSendPackage.mockResolvedValue({
        success: false,
      });

      const { getByTestId } = render(
        <UpdateStatusModal
          {...defaultProps}
          handleCloseModal={handleCloseModal}
        />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalSyncButton"),
      );

      await waitFor(() => {
        expect(mockSendPackage).toHaveBeenCalledTimes(1);
      });

      expect(handleCloseModal).not.toHaveBeenCalled();
    });

    it("does not attempt synchronization when local update fails", async () => {
      mockChangeStatus.mockReturnValue({
        success: false,
      });

      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalSyncButton"),
      );

      await waitFor(() => {
        expect(mockChangeStatus).toHaveBeenCalled();
      });

      expect(mockSendPackage).not.toHaveBeenCalled();
    });
  });

  describe("syncing state", () => {
    beforeEach(() => {
      mockSyncingPackageIds = ["1"];
    });

    it("shows syncing information", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("updateStatusModalSyncingInfo"),
      ).toBeTruthy();
    });

    it("disables picker while syncing", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("mockPickerEnabled"),
      ).toHaveTextContent("false");
    });

    it("disables update button while syncing", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("updateStatusModalUpdateButton"),
      ).toHaveProp(
        "accessibilityState",
        expect.objectContaining({
          disabled: true,
          busy: false,
        }),
      );
    });

    it("disables sync button while syncing", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      expect(
        getByTestId("updateStatusModalSyncButton"),
      ).toHaveProp(
        "accessibilityState",
        expect.objectContaining({
          disabled: true,
          busy: true,
        }),
      );
    });

    it("does not update locally while syncing", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalUpdateButton"),
      );

      expect(mockChangeStatus).not.toHaveBeenCalled();
    });

    it("does not start another sync while already syncing", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalSyncButton"),
      );

      expect(mockChangeStatus).not.toHaveBeenCalled();

      expect(mockSendPackage).not.toHaveBeenCalled();
    });

    it("does not update package when syncing", () => {
      const { getByTestId } = render(
        <UpdateStatusModal {...defaultProps} />,
      );

      fireEvent.press(
        getByTestId("updateStatusModalUpdateButton"),
      );

      expect(mockChangeStatus).not.toHaveBeenCalled();
    });
  });
});
