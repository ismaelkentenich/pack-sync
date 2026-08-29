import {
  act,
  renderHook,
} from "@testing-library/react-native";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { useSessionLifecycle } from "../useSessionLifecycle";

jest.mock("@features/auth/auth.dependencies", () => ({
  authService: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    observeAuthState: jest.fn(),
  },
}));

jest.mock(
  "@features/packages/store/usePackageStore",
  () => ({
    usePackageStore: {
      getState: jest.fn(),
    },
  }),
);

const packageStoreMock = jest.mocked(usePackageStore);
const mockClearUserState = jest.fn();

describe("useSessionLifecycle", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    packageStoreMock.getState.mockReturnValue({
      clearUserState: mockClearUserState,
    } as unknown as ReturnType<
      typeof usePackageStore.getState
    >);

    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  });

  it("clears user-scoped package state when user logs out", () => {
    useAuthStore.setState({
      user: {
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      },
      isAuthenticated: true,
    });

    renderHook(() => useSessionLifecycle());

    expect(mockClearUserState).not.toHaveBeenCalled();

    act(() => {
      useAuthStore.getState().setUser(null);
    });

    expect(mockClearUserState).toHaveBeenCalledTimes(1);
  });

  it("clears user-scoped package state when authenticated user identity changes", () => {
    useAuthStore.setState({
      user: {
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      },
      isAuthenticated: true,
    });

    renderHook(() => useSessionLifecycle());

    act(() => {
      useAuthStore.getState().setUser({
        id: "user-2",
        email: "user2@example.com",
        displayName: null,
      });
    });

    expect(mockClearUserState).toHaveBeenCalledTimes(1);
  });

  it("does not clear package state when the same user identity is re-emitted", () => {
    useAuthStore.setState({
      user: {
        id: "user-1",
        email: "old@example.com",
        displayName: null,
      },
      isAuthenticated: true,
    });

    renderHook(() => useSessionLifecycle());

    act(() => {
      useAuthStore.getState().setUser({
        id: "user-1",
        email: "updated@example.com",
        displayName: "Updated User",
      });
    });

    expect(mockClearUserState).not.toHaveBeenCalled();
  });

  it("clears package state when transitioning from unauthenticated to authenticated", () => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });

    renderHook(() => useSessionLifecycle());

    act(() => {
      useAuthStore.getState().setUser({
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      });
    });

    expect(mockClearUserState).toHaveBeenCalledTimes(1);
  });
});
