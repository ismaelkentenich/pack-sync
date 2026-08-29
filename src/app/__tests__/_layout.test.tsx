import {
  act,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { setupAllDatabases } from "@infrastructure/database/setup";
import { AppContent } from "../_layout";

jest.mock("@infrastructure/database/setup", () => ({
  setupAllDatabases: jest.fn(),
}));

jest.mock("@features/auth/hooks/usePersistedAuth", () => ({
  usePersistedAuth: () => ({
    isRestoring: false,
  }),
}));

jest.mock("@features/auth/store/useAuthStore", () => ({
  selectIsAuthenticated: (state: { user: unknown }) =>
    state.user !== null,
  useAuthStore: jest.fn((selector) =>
    selector({
      user: null,
    }),
  ),
}));

jest.mock(
  "@features/packages/hooks/useNetworkSync",
  () => ({
    useNetworkSync: jest.fn(),
  }),
);

jest.mock("expo-router", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  const Stack = ({
    children,
  }: {
    children: React.ReactNode;
  }) => <View testID="mockRouterStack">{children}</View>;

  const MockScreen = () => null;
  MockScreen.displayName = "MockScreen";
  Stack.Screen = MockScreen;

  const MockProtected = ({
    children,
  }: {
    children: React.ReactNode;
  }) => <>{children}</>;
  MockProtected.displayName = "MockProtected";
  Stack.Protected = MockProtected;

  return { Stack };
});

jest.mock("@theme/useAppTheme", () => {
  const { lightTheme } = jest.requireActual(
    "../../theme/appTheme",
  );
  return {
    useAppTheme: () => ({
      theme: lightTheme,
      resolvedTheme: "light",
      preference: "system",
    }),
  };
});

function createDeferred<T>() {
  let resolve = (_value: T) => {};
  let reject = (_reason?: unknown) => {};

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe("AppContent / Database Bootstrap", () => {
  const setupAllDatabasesMock = jest.mocked(
    setupAllDatabases,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading startup state during cold start and does not mount router prematurely", async () => {
    const deferred = createDeferred<void>();
    setupAllDatabasesMock.mockReturnValue(deferred.promise);

    const { getByTestId, queryByTestId } = render(
      <AppContent />,
    );

    // Verifies startup loading indicator is rendered
    expect(
      getByTestId("databaseStartupLoading"),
    ).toBeTruthy();

    // Verifies router navigation is not rendered before database is ready
    expect(queryByTestId("mockRouterStack")).toBeNull();

    // Resolve database bootstrap
    await act(async () => {
      deferred.resolve();
    });

    // Verifies router navigation is mounted after ready
    await waitFor(() => {
      expect(getByTestId("mockRouterStack")).toBeTruthy();
    });

    expect(
      queryByTestId("databaseStartupLoading"),
    ).toBeNull();
    expect(
      queryByTestId("databaseRecoveryError"),
    ).toBeNull();
  });

  it("displays recovery error screen when database setup / migration fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setupAllDatabasesMock.mockRejectedValue(
      new Error("Migration error: column already exists"),
    );

    const { getByTestId, queryByTestId, getByText } =
      render(<AppContent />);

    await waitFor(() => {
      expect(
        getByTestId("databaseRecoveryError"),
      ).toBeTruthy();
    });

    expect(
      getByText("Migration error: column already exists"),
    ).toBeTruthy();
    expect(getByTestId("databaseRetryButton")).toBeTruthy();

    // Verifies the app navigation is blocked and does not open normally
    expect(queryByTestId("mockRouterStack")).toBeNull();
    expect(
      queryByTestId("databaseStartupLoading"),
    ).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it("retries database bootstrap when retry button is pressed", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setupAllDatabasesMock
      .mockRejectedValueOnce(
        new Error("Initial setup failed"),
      )
      .mockResolvedValueOnce(undefined);

    const { getByTestId, queryByTestId } = render(
      <AppContent />,
    );

    await waitFor(() => {
      expect(
        getByTestId("databaseRecoveryError"),
      ).toBeTruthy();
    });

    const retryButton = getByTestId("databaseRetryButton");

    await act(async () => {
      fireEvent.press(retryButton);
    });

    await waitFor(() => {
      expect(getByTestId("mockRouterStack")).toBeTruthy();
    });

    expect(
      queryByTestId("databaseRecoveryError"),
    ).toBeNull();
    expect(setupAllDatabasesMock).toHaveBeenCalledTimes(2);

    consoleErrorSpy.mockRestore();
  });
});
