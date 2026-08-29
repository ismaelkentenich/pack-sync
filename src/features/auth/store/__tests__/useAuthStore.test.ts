import { authService } from "@features/auth/auth.dependencies";
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

const authServiceMock = jest.mocked(authService);

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  });

  describe("setUser", () => {
    it("updates user and isAuthenticated state correctly", () => {
      useAuthStore.getState().setUser({
        id: "user-1",
        email: "user1@example.com",
        displayName: "User One",
      });

      expect(useAuthStore.getState()).toMatchObject({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: "User One",
        },
        isAuthenticated: true,
      });

      useAuthStore.getState().setUser(null);

      expect(useAuthStore.getState()).toMatchObject({
        user: null,
        isAuthenticated: false,
      });
    });
  });

  describe("login", () => {
    it("updates user and isAuthenticated on successful login", async () => {
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
      expect(useAuthStore.getState()).toMatchObject({
        user: { id: "user-1" },
        isAuthenticated: true,
      });
    });
  });

  describe("signup", () => {
    it("updates user and isAuthenticated on successful signup", async () => {
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
      expect(useAuthStore.getState()).toMatchObject({
        user: { id: "user-2" },
        isAuthenticated: true,
      });
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
        isAuthenticated: true,
      });

      authServiceMock.logout.mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      expect(authServiceMock.logout).toHaveBeenCalledTimes(
        1,
      );
      expect(useAuthStore.getState()).toMatchObject({
        user: null,
        isAuthenticated: false,
      });
    });

    it("preserves auth state when logout throws an error", async () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
        isAuthenticated: true,
      });

      authServiceMock.logout.mockRejectedValue(
        new Error("Logout network error"),
      );

      await expect(
        useAuthStore.getState().logout(),
      ).rejects.toThrow("Logout network error");

      expect(useAuthStore.getState()).toMatchObject({
        user: { id: "user-1" },
        isAuthenticated: true,
      });
    });
  });
});
