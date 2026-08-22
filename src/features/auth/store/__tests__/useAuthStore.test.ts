import { authService } from "@features/auth/auth.dependencies";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { useAuthStore } from "../useAuthStore";

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

const authServiceMock = jest.mocked(authService);

const packageStoreMock = jest.mocked(usePackageStore);

const mockClearUserState = jest.fn();

describe("useAuthStore identity changes", () => {
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

  describe("setUser", () => {
    it("clears package state when the authenticated identity changes", () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
        isAuthenticated: true,
      });

      useAuthStore.getState().setUser({
        id: "user-2",
        email: "user2@example.com",
        displayName: null,
      });

      expect(mockClearUserState).toHaveBeenCalledTimes(1);

      expect(useAuthStore.getState().user?.id).toBe(
        "user-2",
      );
    });

    it("clears package state when the authenticated user becomes null", () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
        isAuthenticated: true,
      });

      useAuthStore.getState().setUser(null);

      expect(mockClearUserState).toHaveBeenCalledTimes(1);

      expect(useAuthStore.getState()).toMatchObject({
        user: null,
        isAuthenticated: false,
      });
    });

    it("does not clear package state when the same user is emitted again", () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "old@example.com",
          displayName: null,
        },
        isAuthenticated: true,
      });

      useAuthStore.getState().setUser({
        id: "user-1",
        email: "updated@example.com",
        displayName: null,
      });

      expect(mockClearUserState).not.toHaveBeenCalled();

      expect(useAuthStore.getState().user?.email).toBe(
        "updated@example.com",
      );
    });
  });

  describe("login", () => {
    it("clears stale package state before adopting a new identity", async () => {
      authServiceMock.login.mockResolvedValue({
        id: "user-2",
        email: "user2@example.com",
        displayName: null,
      });

      await useAuthStore
        .getState()
        .login("user2@example.com", "password");

      expect(mockClearUserState).toHaveBeenCalledTimes(1);

      expect(useAuthStore.getState()).toMatchObject({
        user: {
          id: "user-2",
        },
        isAuthenticated: true,
      });
    });
  });

  describe("signup", () => {
    it("clears stale package state before adopting the created identity", async () => {
      authServiceMock.signup.mockResolvedValue({
        id: "user-2",
        email: "user2@example.com",
        displayName: null,
      });

      await useAuthStore
        .getState()
        .signup("user2@example.com", "password");

      expect(mockClearUserState).toHaveBeenCalledTimes(1);

      expect(useAuthStore.getState()).toMatchObject({
        user: {
          id: "user-2",
        },
        isAuthenticated: true,
      });
    });
  });

  describe("logout", () => {
    it("clears package state after logout succeeds", async () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
        isAuthenticated: true,
      });

      authServiceMock.logout.mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      expect(authServiceMock.logout).toHaveBeenCalledTimes(
        1,
      );

      expect(mockClearUserState).toHaveBeenCalledTimes(1);

      expect(useAuthStore.getState()).toMatchObject({
        user: null,
        isAuthenticated: false,
      });
    });

    it("preserves auth and package state when logout fails", async () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
        isAuthenticated: true,
      });

      authServiceMock.logout.mockRejectedValue(
        new Error("Logout failed"),
      );

      await expect(
        useAuthStore.getState().logout(),
      ).rejects.toThrow("Logout failed");

      expect(mockClearUserState).not.toHaveBeenCalled();

      expect(useAuthStore.getState()).toMatchObject({
        user: {
          id: "user-1",
        },
        isAuthenticated: true,
      });
    });
  });
});
