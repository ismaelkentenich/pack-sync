import { authService } from "@features/auth/auth.dependencies";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { login, logout, signup } from "../index";

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

describe("Auth Application Use Cases (Without React Rendering)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: null,
      sessionGeneration: 0,
    });
  });

  describe("login", () => {
    it("authenticates via authService and updates useAuthStore", async () => {
      const mockUser = {
        id: "user-1",
        email: "user1@example.com",
        displayName: "User One",
      };
      authServiceMock.login.mockResolvedValue(mockUser);

      await login("user1@example.com", "password123");

      expect(authServiceMock.login).toHaveBeenCalledWith(
        "user1@example.com",
        "password123",
      );
      expect(useAuthStore.getState().user).toEqual(
        mockUser,
      );
    });

    it("throws and does not update store when service fails", async () => {
      authServiceMock.login.mockRejectedValue(
        new Error("Invalid credentials"),
      );

      await expect(
        login("user1@example.com", "wrongpass"),
      ).rejects.toThrow("Invalid credentials");

      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe("signup", () => {
    it("creates user via authService and updates useAuthStore", async () => {
      const mockUser = {
        id: "user-2",
        email: "user2@example.com",
        displayName: null,
      };
      authServiceMock.signup.mockResolvedValue(mockUser);

      await signup("user2@example.com", "password123");

      expect(authServiceMock.signup).toHaveBeenCalledWith(
        "user2@example.com",
        "password123",
      );
      expect(useAuthStore.getState().user).toEqual(
        mockUser,
      );
    });
  });

  describe("logout", () => {
    it("logs out via authService and clears user in useAuthStore", async () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
      });

      authServiceMock.logout.mockResolvedValue(undefined);

      await logout();

      expect(authServiceMock.logout).toHaveBeenCalledTimes(
        1,
      );
      expect(useAuthStore.getState().user).toBeNull();
    });
  });
});
