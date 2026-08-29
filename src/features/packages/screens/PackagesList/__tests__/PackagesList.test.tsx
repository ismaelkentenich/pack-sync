import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import PackagesListScreen from "../index";
import type { Package } from "@features/packages/domain/package.types";

const mockNavigate = jest.fn();
const mockLoadPackages = jest.fn();
const mockSyncPendingPackages = jest.fn();

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

jest.mock("@hooks/usePackagesNavigation", () => ({
  usePackagesNavigation: () => ({
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

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) =>
      options?.count !== undefined
        ? `${key}_${options.count}`
        : key,
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

jest.mock(
  "@features/packages/components/UpdateStatusModal",
  () => () => null,
);

jest.mock("@shopify/flash-list", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  return {
    FlashList: ({
      data,
      renderItem,
      ListHeaderComponent,
      ListEmptyComponent,
    }: {
      data: Package[];
      renderItem: ({
        item,
      }: {
        item: Package;
      }) => React.ReactNode;
      ListHeaderComponent?: React.ReactNode;
      ListEmptyComponent?: React.ReactNode;
    }) => (
      <View testID="flashListRoot">
        {ListHeaderComponent}
        {data && data.length > 0
          ? data.map((item) => (
              <View key={item.id ?? item.code}>
                {renderItem({ item })}
              </View>
            ))
          : ListEmptyComponent}
      </View>
    ),
  };
});

let mockPackages: Package[] = [];
let mockPendingCount = 0;
let mockIsSyncingPending = false;

jest.mock(
  "@features/packages/hooks/usePackageOperations",
  () => ({
    usePackageOperations: () => ({
      loadPackages: mockLoadPackages,
      syncPendingPackages: mockSyncPendingPackages,
    }),
  }),
);

jest.mock(
  "@features/packages/store/usePackageStore",
  () => ({
    usePackageStore: (
      selector: (state: {
        packages: Package[];
        pendingCount: number;
        isSyncingPending: boolean;
      }) => unknown,
    ) =>
      selector({
        packages: mockPackages,
        pendingCount: mockPendingCount,
        isSyncingPending: mockIsSyncingPending,
      }),
  }),
);

describe("PackagesListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPackages = [];
    mockPendingCount = 0;
    mockIsSyncingPending = false;
  });

  it("renders packages list screen and loads packages on mount", () => {
    const { getByTestId } = render(<PackagesListScreen />);

    expect(getByTestId("packagesListScreen")).toBeTruthy();
    expect(mockLoadPackages).toHaveBeenCalledWith(
      "user-123",
    );
  });

  it("renders empty state when there are no packages", () => {
    const { getByTestId } = render(<PackagesListScreen />);

    expect(
      getByTestId("packagesListEmptyState"),
    ).toBeTruthy();
    expect(
      getByTestId("packagesListEmptyTitle"),
    ).toBeTruthy();
  });

  it("does not display sync banner when pendingCount is 0", () => {
    mockPackages = [
      {
        id: "1",
        code: "PKG-001",
        clientCode: "CLI-001",
        status: PackageStatus.COLLECTED,
        deliveryStatus: DeliveryStatus.SENT,
        scanned_at: "2026-08-28T12:00:00Z",
      },
    ];
    mockPendingCount = 0;

    const { queryByTestId } = render(
      <PackagesListScreen />,
    );

    expect(
      queryByTestId("packagesListSyncBanner"),
    ).toBeNull();
  });

  it("displays sync banner and triggers sync with haptics when pendingCount > 0", () => {
    mockPackages = [
      {
        id: "1",
        code: "PKG-001",
        clientCode: "CLI-001",
        status: PackageStatus.COLLECTED,
        deliveryStatus: DeliveryStatus.PENDING,
        scanned_at: "2026-08-28T12:00:00Z",
      },
    ];
    mockPendingCount = 1;

    const { getByTestId } = render(<PackagesListScreen />);

    expect(
      getByTestId("packagesListSyncBanner"),
    ).toBeTruthy();
    expect(
      getByTestId("packagesListSyncBannerTitle"),
    ).toBeTruthy();

    const syncButton = getByTestId(
      "packagesListSyncButton",
    );
    fireEvent.press(syncButton);

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
    expect(mockSyncPendingPackages).toHaveBeenCalledWith(
      "user-123",
    );
  });

  it("filters packages by status filter and search term", () => {
    mockPackages = [
      {
        id: "1",
        code: "PKG-COLLECTED",
        clientCode: "CLI-001",
        status: PackageStatus.COLLECTED,
        deliveryStatus: DeliveryStatus.SENT,
        scanned_at: "2026-08-28T12:00:00Z",
      },
      {
        id: "2",
        code: "PKG-DELIVERED",
        clientCode: "CLI-001",
        status: PackageStatus.DELIVERED,
        deliveryStatus: DeliveryStatus.SENT,
        scanned_at: "2026-08-28T12:00:00Z",
      },
    ];

    const { getByTestId, queryByText } = render(
      <PackagesListScreen />,
    );

    const filterCollected = getByTestId(
      `packagesListFilter-${PackageStatus.COLLECTED}`,
    );
    fireEvent.press(filterCollected);

    expect(queryByText(/PKG-COLLECTED/)).toBeTruthy();
  });
});
