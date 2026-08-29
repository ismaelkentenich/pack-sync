import {
  emitAppState,
  mockAppState,
  resetAppStateMock,
} from "@test/mocks/appState.mock";
import {
  mockAuthStore,
  resetAuthStoreMock,
  setMockCurrentUserId,
} from "@test/mocks/authStore.mock";
import {
  emitNetworkState,
  mockNetInfoFetch,
  resetNetInfoMock,
} from "@test/mocks/netInfo.mock";
import {
  mockSyncPendingPackages,
  resetPackageStoreMock,
} from "@test/mocks/packageStore.mock";
import { useNetworkSync } from "../useNetworkSync";

let mockEffectCleanup: (() => void) | undefined;

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

jest.mock("react", () => {
  const actualReact = jest.requireActual("react");

  return {
    ...actualReact,

    useEffect: (effect: () => void | (() => void)) => {
      const cleanup = effect();

      if (typeof cleanup === "function") {
        mockEffectCleanup = cleanup;
      }
    },
  };
});

jest.mock("@react-native-community/netinfo");

jest.mock("@features/auth/store/useAuthStore", () => ({
  useAuthStore: mockAuthStore,
}));

jest.mock(
  "@features/packages/hooks/usePackageOperations",
  () => ({
    usePackageOperations: () => ({
      syncPendingPackages: mockSyncPendingPackages,
    }),
  }),
);

describe("useNetworkSync", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockEffectCleanup = undefined;

    resetNetInfoMock();
    resetAppStateMock();
    resetAuthStoreMock();
    resetPackageStoreMock();

    mockAppState();
  });

  afterEach(() => {
    mockEffectCleanup?.();

    jest.restoreAllMocks();
  });

  it("reconciles pending packages after session restoration when online", async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: true,
    });

    useNetworkSync("user-1");

    await flushPromises();

    expect(mockSyncPendingPackages).toHaveBeenCalledTimes(
      1,
    );

    expect(mockSyncPendingPackages).toHaveBeenCalledWith(
      "user-1",
    );
  });

  it("keeps pending packages local while offline and reconciles after reconnect", async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: false,
    });

    useNetworkSync("user-1");

    await flushPromises();

    expect(mockSyncPendingPackages).not.toHaveBeenCalled();

    emitNetworkState({
      isConnected: true,
    });

    expect(mockSyncPendingPackages).toHaveBeenCalledWith(
      "user-1",
    );
  });

  it("reconciles when the application returns to foreground", async () => {
    mockNetInfoFetch
      .mockResolvedValueOnce({
        isConnected: false,
      })
      .mockResolvedValueOnce({
        isConnected: true,
      });

    useNetworkSync("user-1");

    await flushPromises();

    emitAppState("background");
    emitAppState("active");

    await flushPromises();

    expect(mockSyncPendingPackages).toHaveBeenCalledWith(
      "user-1",
    );
  });

  it("does not synchronize when the authenticated user changed", async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: true,
    });

    setMockCurrentUserId("user-2");

    useNetworkSync("user-1");

    await flushPromises();

    expect(mockSyncPendingPackages).not.toHaveBeenCalled();
  });

  it("does nothing when there is no authenticated user", async () => {
    useNetworkSync(undefined);

    await flushPromises();

    expect(mockNetInfoFetch).not.toHaveBeenCalled();
    expect(mockSyncPendingPackages).not.toHaveBeenCalled();
  });
});
