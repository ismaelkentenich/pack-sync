import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { Linking } from "react-native";
import ScanScreen from "../index";

const mockNavigate = jest.fn();
const mockShowAlert = jest.fn();
const mockScanPackage = jest.fn();
const mockLoadPackages = jest.fn();
const mockResetSession = jest.fn();
const mockClearFeedback = jest.fn();
const mockSendAllCurrentSessionPackages = jest.fn();
const mockRequestPermission = jest.fn();

const mockUser = {
  id: "user-123",
  email: "user@example.com",
};

jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

jest.mock("expo-camera", () => ({
  useCameraPermissions: jest.fn(),
  CameraView: "CameraView",
}));

jest.mock("expo-router", () => ({
  useFocusEffect: (cb: () => void) => {
    const React = jest.requireActual("react");
    React.useEffect(() => {
      cb();
    }, [cb]);
  },
}));

jest.mock("@hooks/useMainTabNavigation", () => ({
  useMainTabNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("@features/auth/store/useAuthStore", () => ({
  useAuthStore: (
    selector: (state: { user: typeof mockUser }) => unknown,
  ) =>
    selector({
      user: mockUser,
    }),
}));

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

const mockRemoveFromSession = jest.fn();

let mockCurrentSessionPackages: unknown[] = [];

let mockFeedback: {
  success: {
    key: string;
    params?: Record<string, unknown>;
  } | null;
  error: {
    key: string;
    params?: Record<string, unknown>;
  } | null;
} = {
  success: null,
  error: null,
};

jest.mock(
  "@features/packages/store/usePackageStore",
  () => ({
    usePackageStore: (
      selector: (state: {
        isSyncingSession: boolean;
        currentSessionPackages: typeof mockCurrentSessionPackages;
        feedback: typeof mockFeedback;
        scanPackage: typeof mockScanPackage;
        loadPackages: typeof mockLoadPackages;
        resetSession: typeof mockResetSession;
        clearFeedback: typeof mockClearFeedback;
        removeFromSession: typeof mockRemoveFromSession;
        sendAllCurrentSessionPackages: typeof mockSendAllCurrentSessionPackages;
      }) => unknown,
    ) =>
      selector({
        isSyncingSession: false,
        currentSessionPackages: mockCurrentSessionPackages,
        feedback: mockFeedback,
        scanPackage: mockScanPackage,
        loadPackages: mockLoadPackages,
        resetSession: mockResetSession,
        clearFeedback: mockClearFeedback,
        removeFromSession: mockRemoveFromSession,
        sendAllCurrentSessionPackages:
          mockSendAllCurrentSessionPackages,
      }),
  }),
);

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "pt-BR",
      resolvedLanguage: "pt-BR",
    },
  }),
}));

jest.mock("@components/primitives/ScreenContainer", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  return {
    ScreenContainer: ({
      children,
      testID,
    }: {
      children: React.ReactNode;
      testID?: string;
    }) => (
      <View testID={testID ?? "screenContainerRoot"}>
        {children}
      </View>
    ),
  };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock(
  "@features/packages/components/UpdateAllPackagesModal",
  () => () => null,
);

jest.mock("@gorhom/bottom-sheet", () => ({
  BottomSheetModal: "BottomSheetModal",
}));

jest.mock("@shopify/flash-list", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  return {
    FlashList: ({
      data,
      renderItem,
    }: {
      data?: unknown[];
      renderItem: ({
        item,
      }: {
        item: unknown;
      }) => React.ReactNode;
    }) => (
      <View testID="flashListRoot">
        {data?.map((item, index) => (
          <View key={index}>{renderItem({ item })}</View>
        ))}
      </View>
    ),
  };
});

describe("ScanScreen - Camera Permissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentSessionPackages = [];
    mockFeedback = { success: null, error: null };
    jest
      .spyOn(Linking, "openSettings")
      .mockResolvedValue(undefined as never);
  });

  it("renders loading state when permission is null", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      null,
      mockRequestPermission,
    ]);

    const { getByTestId, queryByTestId } = render(
      <ScanScreen />,
    );

    expect(
      getByTestId("scannerPermissionLoading"),
    ).toBeTruthy();
    expect(
      queryByTestId("scannerPermissionDenied"),
    ).toBeNull();
    expect(
      queryByTestId("scannerCameraSection"),
    ).toBeNull();
  });

  it("automatically requests permission on mount when permission status is undetermined and canAskAgain is true", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: false,
        canAskAgain: true,
        status: "undetermined",
      },
      mockRequestPermission,
    ]);

    render(<ScanScreen />);

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it("renders denied state with Grant Permission button when permission is not granted and canAskAgain is true", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: false,
        canAskAgain: true,
        status: "denied",
      },
      mockRequestPermission,
    ]);

    const { getByTestId, getByText } = render(
      <ScanScreen />,
    );

    expect(
      getByTestId("scannerPermissionDenied"),
    ).toBeTruthy();
    expect(
      getByText("scanner.permissionRequired"),
    ).toBeTruthy();
    expect(
      getByText("scanner.grantPermission"),
    ).toBeTruthy();

    fireEvent.press(
      getByTestId("scannerGrantPermissionButton"),
    );
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it("renders denied state with Open Settings button when permission is permanently denied (canAskAgain is false)", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: false,
        canAskAgain: false,
        status: "denied",
      },
      mockRequestPermission,
    ]);

    const { getByTestId, getByText } = render(
      <ScanScreen />,
    );

    expect(
      getByTestId("scannerPermissionDenied"),
    ).toBeTruthy();
    expect(
      getByText("scanner.permissionRequiredPermanently"),
    ).toBeTruthy();
    expect(getByText("scanner.openSettings")).toBeTruthy();

    fireEvent.press(
      getByTestId("scannerGrantPermissionButton"),
    );
    expect(Linking.openSettings).toHaveBeenCalledTimes(1);
    expect(mockRequestPermission).not.toHaveBeenCalled();
  });

  it("renders camera scanner when permission is granted", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: true,
        canAskAgain: true,
        status: "granted",
      },
      mockRequestPermission,
    ]);

    const { getByTestId, queryByTestId } = render(
      <ScanScreen />,
    );

    expect(getByTestId("scannerContainer")).toBeTruthy();
    expect(
      getByTestId("scannerCameraSection"),
    ).toBeTruthy();
    expect(getByTestId("scannerCamera")).toBeTruthy();
    expect(
      queryByTestId("scannerPermissionDenied"),
    ).toBeNull();
  });

  it("triggers warning haptics when a duplicate code is scanned", async () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: true,
        canAskAgain: true,
        status: "granted",
      },
      mockRequestPermission,
    ]);

    const { getByTestId } = render(<ScanScreen />);
    const camera = getByTestId("scannerCamera");

    // First scan
    await fireEvent(camera, "barcodeScanned", {
      data: "PKG-123",
      type: "qr",
    });

    expect(mockScanPackage).toHaveBeenCalledWith(
      "PKG-123",
      "user-123",
    );

    // Second scan with same code immediately (continuous presence) -> silently suppressed!
    (Haptics.notificationAsync as jest.Mock).mockClear();

    await fireEvent(camera, "barcodeScanned", {
      data: "PKG-123",
      type: "qr",
    });

    expect(
      Haptics.notificationAsync,
    ).not.toHaveBeenCalled();
    expect(mockShowAlert).not.toHaveBeenCalled();

    // Scan a different code immediately -> allowed without delay!
    await fireEvent(camera, "barcodeScanned", {
      data: "PKG-456",
      type: "qr",
    });

    expect(mockScanPackage).toHaveBeenCalledWith(
      "PKG-456",
      "user-123",
    );

    // Re-introducing the first code (PKG-123) after another code -> triggers warning ONCE
    (Haptics.notificationAsync as jest.Mock).mockClear();
    mockShowAlert.mockClear();

    await fireEvent(camera, "barcodeScanned", {
      data: "PKG-123",
      type: "qr",
    });

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Warning,
    );
    expect(mockShowAlert).toHaveBeenCalledWith(
      "packages.feedback.alreadyScanned",
      "info",
    );
  });

  it("triggers success haptics and alert when feedback has success", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: true,
        canAskAgain: true,
        status: "granted",
      },
      mockRequestPermission,
    ]);

    mockFeedback = {
      success: {
        key: "packages.feedback.scannedSuccessfully",
        params: { code: "PKG-123" },
      },
      error: null,
    };

    render(<ScanScreen />);

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
    expect(mockShowAlert).toHaveBeenCalledWith(
      "packages.feedback.scannedSuccessfully",
      "success",
    );
    expect(mockClearFeedback).toHaveBeenCalled();
  });

  it("triggers error haptics and alert when feedback has error", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: true,
        canAskAgain: true,
        status: "granted",
      },
      mockRequestPermission,
    ]);

    mockFeedback = {
      success: null,
      error: {
        key: "packages.errors.invalidForSync",
      },
    };

    render(<ScanScreen />);

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Error,
    );
    expect(mockShowAlert).toHaveBeenCalledWith(
      "packages.errors.invalidForSync",
      "error",
    );
    expect(mockClearFeedback).toHaveBeenCalled();
  });

  it("renders torch toggle button and toggles flashlight state with haptic feedback", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: true,
        canAskAgain: true,
        status: "granted",
      },
      mockRequestPermission,
    ]);

    const { getByTestId } = render(<ScanScreen />);

    const torchButton = getByTestId("scannerTorchButton");
    const camera = getByTestId("scannerCamera");

    expect(camera).toHaveProp("enableTorch", false);
    expect(torchButton).toHaveProp("accessibilityState", {
      checked: false,
    });
    expect(torchButton).toHaveProp(
      "accessibilityLabel",
      "scanner.turnTorchOn",
    );

    // Turn torch on
    fireEvent.press(torchButton);

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
    expect(camera).toHaveProp("enableTorch", true);
    expect(torchButton).toHaveProp("accessibilityState", {
      checked: true,
    });
    expect(torchButton).toHaveProp(
      "accessibilityLabel",
      "scanner.turnTorchOff",
    );

    // Turn torch off
    fireEvent.press(torchButton);

    expect(camera).toHaveProp("enableTorch", false);
    expect(torchButton).toHaveProp("accessibilityState", {
      checked: false,
    });
    expect(torchButton).toHaveProp(
      "accessibilityLabel",
      "scanner.turnTorchOn",
    );
  });

  it("renders session packages and allows quick removal with haptics", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {
        granted: true,
        canAskAgain: true,
        status: "granted",
      },
      mockRequestPermission,
    ]);

    const sessionPkg = {
      id: "pkg-1",
      code: "PKG-123",
      clientCode: "user-123",
      status: "Coletado",
      deliveryStatus: "pending",
      scanned_at: "2026-08-28T12:00:00Z",
    };

    mockCurrentSessionPackages = [sessionPkg];

    const { getByTestId } = render(<ScanScreen />);

    expect(
      getByTestId("scannerSessionItem-pkg-1"),
    ).toBeTruthy();

    const removeBtn = getByTestId(
      "packageCardRemoveButton",
    );
    expect(removeBtn).toBeTruthy();

    fireEvent.press(removeBtn);

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
    expect(mockRemoveFromSession).toHaveBeenCalledWith(
      sessionPkg,
      "user-123",
    );
  });
});
