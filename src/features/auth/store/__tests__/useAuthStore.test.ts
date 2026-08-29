import { authService } from "@features/auth/auth.dependencies";
import {
  selectIsAuthenticated,
  useAuthStore,
} from "../useAuthStore";

jest.mock("@features/auth/auth.dependencies", () => ({
  authService: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    observeAuthState: jest.fn(),
  },
}));

const authServiceMock = jest.mocked(authService);

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: null,
    });
  });

  describe("selectIsAuthenticated", () => {
    it("returns true when user is present and false when user is null", () => {
      expect(selectIsAuthenticated({ user: null })).toBe(
        false,
      );
      expect(
        selectIsAuthenticated({
          user: {
            id: "1",
            email: "test@example.com",
            displayName: null,
          },
        }),
      ).toBe(true);
    });
  });

  describe("setUser", () => {
    it("updates user state correctly", () => {
      useAuthStore.getState().setUser({
        id: "user-1",
        email: "user1@example.com",
        displayName: "User One",
      });

      expect(useAuthStore.getState().user).toEqual({
        id: "user-1",
        email: "user1@example.com",
        displayName: "User One",
      });
      expect(
        selectIsAuthenticated(useAuthStore.getState()),
      ).toBe(true);

      useAuthStore.getState().setUser(null);

      expect(useAuthStore.getState().user).toBeNull();
      expect(
        selectIsAuthenticated(useAuthStore.getState()),
      ).toBe(false);
    });
  });

  describe("login", () => {
    it("updates user on successful login", async () => {
      authServiceMock.login.mockResolvedValue({
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      });

      await useAuthStore
        .getState()
        .login("user1@example.com", "password123");

      expect(authServiceMock.login).toHaveBeenCalledWith(
        "user1@example.com",
        "password123",
      );
      expect(useAuthStore.getState().user).toEqual({
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      });
      expect(
        selectIsAuthenticated(useAuthStore.getState()),
      ).toBe(true);
    });
  });

  describe("signup", () => {
    it("updates user on successful signup", async () => {
      authServiceMock.signup.mockResolvedValue({
        id: "user-2",
        email: "user2@example.com",
        displayName: null,
      });

      await useAuthStore
        .getState()
        .signup("user2@example.com", "password123");

      expect(authServiceMock.signup).toHaveBeenCalledWith(
        "user2@example.com",
        "password123",
      );
      expect(useAuthStore.getState().user).toEqual({
        id: "user-2",
        email: "user2@example.com",
        displayName: null,
      });
      expect(
        selectIsAuthenticated(useAuthStore.getState()),
      ).toBe(true);
    });
  });

  describe("logout", () => {
    it("clears auth state on successful logout", async () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
      });

      authServiceMock.logout.mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      expect(authServiceMock.logout).toHaveBeenCalledTimes(
        1,
      );
      expect(useAuthStore.getState().user).toBeNull();
      expect(
        selectIsAuthenticated(useAuthStore.getState()),
      ).toBe(false);
    });

    it("preserves auth state when logout throws an error", async () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
      });

      authServiceMock.logout.mockRejectedValue(
        new Error("Logout network error"),
      );

      await expect(
        useAuthStore.getState().logout(),
      ).rejects.toThrow("Logout network error");

      expect(useAuthStore.getState().user).toEqual({
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      });
      expect(
        selectIsAuthenticated(useAuthStore.getState()),
      ).toBe(true);
    });
  });

  describe("sessionGeneration", () => {
    it("increments sessionGeneration on setUser, login, signup, logout, and invalidateSession", async () => {
      useAuthStore.setState({
        user: null,
        sessionGeneration: 0,
      });

      useAuthStore.getState().setUser({
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      });
      expect(
        useAuthStore.getState().sessionGeneration,
      ).toBe(1);

      useAuthStore.getState().invalidateSession();
      expect(
        useAuthStore.getState().sessionGeneration,
      ).toBe(2);

      authServiceMock.login.mockResolvedValue({
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      });
      await useAuthStore
        .getState()
        .login("user1@example.com", "password");
      expect(
        useAuthStore.getState().sessionGeneration,
      ).toBe(3);

      authServiceMock.signup.mockResolvedValue({
        id: "user-2",
        email: "user2@example.com",
        displayName: null,
      });
      await useAuthStore
        .getState()
        .signup("user2@example.com", "password");
      expect(
        useAuthStore.getState().sessionGeneration,
      ).toBe(4);

      authServiceMock.logout.mockResolvedValue(undefined);
      await useAuthStore.getState().logout();
      expect(
        useAuthStore.getState().sessionGeneration,
      ).toBe(5);
    });
  });
});
