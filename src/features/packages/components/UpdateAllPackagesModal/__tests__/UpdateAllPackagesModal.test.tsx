import {
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import React, { type ReactNode } from "react";
import { PackageStatus } from "@features/packages/domain/package.enums";
import UpdateAllPackagesModal from "../index";

const mockShowAlert = jest.fn();

const mockHandleCloseModal = jest.fn();
const mockOnSuccessNavigate = jest.fn();

const mockUpdateAndSendCurrentSessionPackages = jest.fn();

let mockPackageStoreState = {
  isSyncingSession: false,

  currentSessionPackages: [
    {
      id: "1",
      code: "PKG-001",
    },
    {
      id: "2",
      code: "PKG-002",
    },
  ],

  updateAndSendCurrentSessionPackages:
    mockUpdateAndSendCurrentSessionPackages,
};

jest.mock(
  "@features/packages/store/usePackageStore",
  () => ({
    usePackageStore: (
      selector: (
        state: typeof mockPackageStoreState,
      ) => unknown,
    ) => selector(mockPackageStoreState),
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
    t: (
      key: string,
      params?: {
        count?: number;
      },
    ) => {
      if (key === "packages.updateAll.packagesInSession") {
        return `${params?.count} packages in session`;
      }

      return key;
    },
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 20,
    left: 0,
  }),
}));

jest.mock(
  "@components/composites/ModalWrapper/ModalWrapper",
  () => {
    const React = jest.requireActual("react");

    const { TouchableOpacity, View } =
      jest.requireActual("react-native");

    return {
      ModalWrapper: React.forwardRef(
        function MockModalWrapper(
          {
            children,
            testID,
            hasInputInsideModal,
            isBlocked,
            snapPoints,
          }: {
            children?: ReactNode;
            testID?: string;
            hasInputInsideModal?: boolean;
            isBlocked?: boolean;
            snapPoints?: Array<string | number>;
          },
          _ref: React.ForwardedRef<unknown>,
        ) {
          return React.createElement(
            View,
            {
              testID: testID ?? "mockModalWrapper",
              hasInputInsideModal,
              isBlocked,
              snapPoints,
            },
            children,
          );
        },
      ),

      ModalCloseIcon: ({
        onPress,
        testID,
        disabled,
      }: {
        onPress: () => void;
        testID?: string;
        disabled?: boolean;
      }) =>
        React.createElement(TouchableOpacity, {
          testID: testID ?? "mockModalCloseButton",
          onPress,
          disabled,
        }),
    };
  },
);

jest.mock("@react-native-picker/picker", () => {
  const React = jest.requireActual("react");

  const { View } = jest.requireActual("react-native");

  function Picker({
    selectedValue,
    onValueChange,
    enabled,
    testID,
    children,
  }: {
    selectedValue?: unknown;
    onValueChange?: (value: unknown) => void;
    enabled?: boolean;
    testID?: string;
    children?: ReactNode;
  }) {
    return React.createElement(
      View,
      {
        testID,
        selectedValue,
        onValueChange,
        enabled,
      },
      children,
    );
  }

  Picker.Item = function PickerItem() {
    return null;
  };

  return {
    Picker,
  };
});

describe("UpdateAllPackagesModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockPackageStoreState = {
      isSyncingSession: false,

      currentSessionPackages: [
        {
          id: "1",
          code: "PKG-001",
        },
        {
          id: "2",
          code: "PKG-002",
        },
      ],

      updateAndSendCurrentSessionPackages:
        mockUpdateAndSendCurrentSessionPackages,
    };

    mockUpdateAndSendCurrentSessionPackages.mockResolvedValue(
      {
        success: true,
      },
    );
  });

  function renderModal() {
    return render(
      <UpdateAllPackagesModal
        userId="user-1"
        handleCloseModal={mockHandleCloseModal}
        onSuccessNavigate={mockOnSuccessNavigate}
      />,
    );
  }

  describe("rendering", () => {
    it("renders modal content", () => {
      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesModal"),
      ).toBeTruthy();

      expect(
        getByTestId("updateAllPackagesContent"),
      ).toBeTruthy();
    });

    it("renders title", () => {
      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesTitle"),
      ).toHaveTextContent("packages.updateAll.title");
    });

    it("renders description", () => {
      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesDescription"),
      ).toHaveTextContent("packages.updateAll.description");
    });

    it("renders session summary", () => {
      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesSummary"),
      ).toBeTruthy();

      expect(
        getByTestId("updateAllPackagesCount"),
      ).toHaveTextContent("2 packages in session");
    });

    it("renders summary icon", () => {
      const { getAllByTestId } = renderModal();

      expect(
        getAllByTestId("updateAllPackagesSummaryIcon")
          .length,
      ).toBeGreaterThan(0);
    });

    it("renders status selector", () => {
      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesPickerWrapper"),
      ).toBeTruthy();

      expect(
        getByTestId("updateAllPackagesPicker"),
      ).toBeTruthy();
    });

    it("starts with collected status", () => {
      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesPicker"),
      ).toHaveProp(
        "selectedValue",
        PackageStatus.COLLECTED,
      );
    });

    it("does not render receiver input by default", () => {
      const { queryByTestId } = renderModal();

      expect(
        queryByTestId("updateAllPackagesReceiverInput"),
      ).toBeNull();
    });

    it("renders submit button", () => {
      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesSubmitButton"),
      ).toBeTruthy();
    });
  });

  describe("close", () => {
    it("closes modal when close button is pressed", () => {
      const { getByTestId } = renderModal();

      fireEvent.press(
        getByTestId("updateAllPackagesCloseButton"),
      );

      expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
    });
  });

  describe("status selection", () => {
    it("shows receiver input when delivered is selected", () => {
      const { getByTestId } = renderModal();

      fireEvent(
        getByTestId("updateAllPackagesPicker"),
        "valueChange",
        PackageStatus.DELIVERED,
      );

      expect(
        getByTestId("updateAllPackagesReceiverInput"),
      ).toBeTruthy();
    });

    it("hides receiver input again when a non-delivered status is selected", () => {
      const { getByTestId, queryByTestId } = renderModal();

      const picker = getByTestId("updateAllPackagesPicker");

      fireEvent(
        picker,
        "valueChange",
        PackageStatus.DELIVERED,
      );

      expect(
        getByTestId("updateAllPackagesReceiverInput"),
      ).toBeTruthy();

      fireEvent(
        picker,
        "valueChange",
        PackageStatus.IN_DELIVERY,
      );

      expect(
        queryByTestId("updateAllPackagesReceiverInput"),
      ).toBeNull();
    });
  });

  describe("validation", () => {
    it("blocks update when session is empty", async () => {
      mockPackageStoreState = {
        ...mockPackageStoreState,
        currentSessionPackages: [],
      };

      const { getByTestId } = renderModal();

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          "packages.updateAll.emptySession",
          "error",
        );
      });

      expect(
        mockUpdateAndSendCurrentSessionPackages,
      ).not.toHaveBeenCalled();
    });

    it("blocks delivered update without receiver name", async () => {
      const { getByTestId } = renderModal();

      fireEvent(
        getByTestId("updateAllPackagesPicker"),
        "valueChange",
        PackageStatus.DELIVERED,
      );

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          "packages.updateStatus.receiverRequired",
          "error",
        );
      });

      expect(
        mockUpdateAndSendCurrentSessionPackages,
      ).not.toHaveBeenCalled();
    });

    it("blocks delivered update with whitespace-only receiver", async () => {
      const { getByTestId } = renderModal();

      fireEvent(
        getByTestId("updateAllPackagesPicker"),
        "valueChange",
        PackageStatus.DELIVERED,
      );

      fireEvent.changeText(
        getByTestId("inputField"),
        "   ",
      );

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          "packages.updateStatus.receiverRequired",
          "error",
        );
      });

      expect(
        mockUpdateAndSendCurrentSessionPackages,
      ).not.toHaveBeenCalled();
    });
  });

  describe("update and sync", () => {
    it("updates all packages using selected status", async () => {
      const { getByTestId } = renderModal();

      fireEvent(
        getByTestId("updateAllPackagesPicker"),
        "valueChange",
        PackageStatus.IN_DELIVERY,
      );

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(
          mockUpdateAndSendCurrentSessionPackages,
        ).toHaveBeenCalledWith(
          "user-1",
          PackageStatus.IN_DELIVERY,
          undefined,
        );
      });
    });

    it("trims receiver name before update", async () => {
      const { getByTestId } = renderModal();

      fireEvent(
        getByTestId("updateAllPackagesPicker"),
        "valueChange",
        PackageStatus.DELIVERED,
      );

      fireEvent.changeText(
        getByTestId("inputField"),
        "  Maria Silva  ",
      );

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(
          mockUpdateAndSendCurrentSessionPackages,
        ).toHaveBeenCalledWith(
          "user-1",
          PackageStatus.DELIVERED,
          "Maria Silva",
        );
      });
    });

    it("closes modal after successful update", async () => {
      const { getByTestId } = renderModal();

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(mockHandleCloseModal).toHaveBeenCalledTimes(
          1,
        );
      });
    });

    it("shows success feedback", async () => {
      const { getByTestId } = renderModal();

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          "packages.updateAll.success",
          "success",
        );
      });
    });

    it("navigates after successful update", async () => {
      const { getByTestId } = renderModal();

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(mockOnSuccessNavigate).toHaveBeenCalledTimes(
          1,
        );
      });
    });

    it("does not require success navigation callback", async () => {
      const { getByTestId } = render(
        <UpdateAllPackagesModal
          userId="user-1"
          handleCloseModal={mockHandleCloseModal}
        />,
      );

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(mockHandleCloseModal).toHaveBeenCalledTimes(
          1,
        );
      });
    });
  });

  describe("failure", () => {
    it("shows error when update and sync fails", async () => {
      mockUpdateAndSendCurrentSessionPackages.mockResolvedValue(
        {
          success: false,
        },
      );

      const { getByTestId } = renderModal();

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          "packages.updateAll.error",
          "error",
        );
      });
    });

    it("does not close modal when update fails", async () => {
      mockUpdateAndSendCurrentSessionPackages.mockResolvedValue(
        {
          success: false,
        },
      );

      const { getByTestId } = renderModal();

      fireEvent.press(
        getByTestId("updateAllPackagesSubmitButton"),
      );

      await waitFor(() => {
        expect(
          mockUpdateAndSendCurrentSessionPackages,
        ).toHaveBeenCalled();
      });

      expect(mockHandleCloseModal).not.toHaveBeenCalled();

      expect(mockOnSuccessNavigate).not.toHaveBeenCalled();
    });
  });

  describe("busy state", () => {
    it("disables controls while session is syncing", () => {
      mockPackageStoreState = {
        ...mockPackageStoreState,
        isSyncingSession: true,
      };

      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesPicker"),
      ).toHaveProp("enabled", false);

      expect(
        getByTestId("updateAllPackagesSubmitButton"),
      ).toHaveProp("accessibilityState", {
        disabled: true,
        busy: true,
      });

      expect(
        getByTestId("buttonActivityIndicator"),
      ).toBeTruthy();

      fireEvent.press(
        getByTestId("updateAllPackagesCloseButton"),
      );

      expect(mockHandleCloseModal).not.toHaveBeenCalled();
    });

    it("blocks modal dismissal while syncing", () => {
      mockPackageStoreState = {
        ...mockPackageStoreState,
        isSyncingSession: true,
      };

      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesModal"),
      ).toHaveProp("isBlocked", true);
    });

    it("blocks modal dismissal while syncing", () => {
      mockPackageStoreState = {
        ...mockPackageStoreState,
        isSyncingSession: true,
      };

      const { getByTestId } = renderModal();

      expect(
        getByTestId("updateAllPackagesModal"),
      ).toHaveProp("isBlocked", true);
    });
  });
});
