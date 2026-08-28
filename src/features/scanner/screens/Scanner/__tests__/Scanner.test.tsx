import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { useCameraPermissions } from "expo-camera";
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

jest.mock(
  "@features/packages/store/usePackageStore",
  () => ({
    usePackageStore: (
      selector: (state: {
        isSyncingSession: boolean;
        currentSessionPackages: unknown[];
        feedback: { success: null; error: null };
        scanPackage: typeof mockScanPackage;
        loadPackages: typeof mockLoadPackages;
        resetSession: typeof mockResetSession;
        clearFeedback: typeof mockClearFeedback;
        sendAllCurrentSessionPackages: typeof mockSendAllCurrentSessionPackages;
      }) => unknown,
    ) =>
      selector({
        isSyncingSession: false,
        currentSessionPackages: [],
        feedback: { success: null, error: null },
        scanPackage: mockScanPackage,
        loadPackages: mockLoadPackages,
        resetSession: mockResetSession,
        clearFeedback: mockClearFeedback,
        sendAllCurrentSessionPackages:
          mockSendAllCurrentSessionPackages,
      }),
  }),
);

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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

jest.mock("@shopify/flash-list", () => ({
  FlashList: "FlashList",
}));

describe("ScanScreen - Camera Permissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
