import {
  selectIsAuthenticated,
  useAuthStore,
} from "../useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: null,
      sessionGeneration: 0,
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
    it("updates user state and increments sessionGeneration", () => {
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
      expect(
        useAuthStore.getState().sessionGeneration,
      ).toBe(1);

      useAuthStore.getState().setUser(null);

      expect(useAuthStore.getState().user).toBeNull();
      expect(
        selectIsAuthenticated(useAuthStore.getState()),
      ).toBe(false);
      expect(
        useAuthStore.getState().sessionGeneration,
      ).toBe(2);
    });
  });

  describe("invalidateSession", () => {
    it("increments sessionGeneration without altering user", () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "user1@example.com",
          displayName: null,
        },
        sessionGeneration: 1,
      });

      useAuthStore.getState().invalidateSession();

      expect(
        useAuthStore.getState().sessionGeneration,
      ).toBe(2);
      expect(useAuthStore.getState().user).toEqual({
        id: "user-1",
        email: "user1@example.com",
        displayName: null,
      });
    });
  });
});
