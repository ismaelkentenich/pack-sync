import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import PackageDetailsScreen from "../index";
import type { Package } from "@features/packages/domain/package.types";

const mockSendPackage = jest.fn();

const mockUser = {
  id: "user-123",
  email: "user@example.com",
};

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    code: "PKG-123",
  }),
}));

jest.mock(
  "@features/packages/components/UpdateStatusModal",
  () => ({
    UpdateStatusModal: () => null,
  }),
);

jest.mock("@features/auth/store/useAuthStore", () => ({
  useAuthStore: (
    selector: (state: { user: typeof mockUser }) => unknown,
  ) =>
    selector({
      user: mockUser,
    }),
}));

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
    }) => <View testID={testID}>{children}</View>,
  };
});

let mockPackages: Package[] = [
  {
    id: "1",
    code: "PKG-123",
    clientCode: "CLI-001",
    status: PackageStatus.COLLECTED,
    deliveryStatus: DeliveryStatus.PENDING,
    scanned_at: "2026-08-28T12:00:00Z",
  },
];
let mockSyncingPackageIds: string[] = [];

jest.mock(
  "@features/packages/hooks/usePackageOperations",
  () => ({
    usePackageOperations: () => ({
      sendPackage: mockSendPackage,
    }),
  }),
);

jest.mock(
  "@features/packages/store/usePackageStore",
  () => ({
    usePackageStore: (
      selector: (state: {
        packages: Package[];
        syncingPackageIds: string[];
      }) => unknown,
    ) =>
      selector({
        packages: mockPackages,
        syncingPackageIds: mockSyncingPackageIds,
      }),
  }),
);

describe("PackageDetailsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPackages = [
      {
        id: "1",
        code: "PKG-123",
        clientCode: "CLI-001",
        status: PackageStatus.COLLECTED,
        deliveryStatus: DeliveryStatus.PENDING,
        scanned_at: "2026-08-28T12:00:00Z",
      },
    ];
    mockSyncingPackageIds = [];
  });

  it("renders package details with code and information", () => {
    const { getByTestId } = render(
      <PackageDetailsScreen />,
    );

    expect(
      getByTestId("packageDetailsScreen"),
    ).toBeTruthy();
    expect(
      getByTestId("packageDetailsCode"),
    ).toHaveTextContent("PKG-123");
  });

  it("renders sync button when package has PENDING deliveryStatus and triggers sendPackage with haptics", () => {
    const { getByTestId } = render(
      <PackageDetailsScreen />,
    );

    const syncButton = getByTestId(
      "packageDetailsSyncButton",
    );
    expect(syncButton).toBeTruthy();

    fireEvent.press(syncButton);

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
    expect(mockSendPackage).toHaveBeenCalledWith(
      mockPackages[0],
      "user-123",
    );
  });

  it("does not render sync button when package deliveryStatus is SENT", () => {
    mockPackages = [
      {
        id: "1",
        code: "PKG-123",
        clientCode: "CLI-001",
        status: PackageStatus.COLLECTED,
        deliveryStatus: DeliveryStatus.SENT,
        scanned_at: "2026-08-28T12:00:00Z",
      },
    ];

    const { queryByTestId } = render(
      <PackageDetailsScreen />,
    );

    expect(
      queryByTestId("packageDetailsSyncButton"),
    ).toBeNull();
  });
});
