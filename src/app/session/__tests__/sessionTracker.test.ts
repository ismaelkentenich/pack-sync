import { useAuthStore } from "@features/auth/store/useAuthStore";
import {
  createSessionGuard,
  defaultSessionTracker,
} from "../sessionTracker";

describe("sessionTracker & createSessionGuard", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      sessionGeneration: 0,
    });
  });

  describe("defaultSessionTracker", () => {
    it("returns current session generation from useAuthStore", () => {
      expect(
        defaultSessionTracker.getSessionGeneration(),
      ).toBe(0);

      useAuthStore.setState({ sessionGeneration: 5 });

      expect(
        defaultSessionTracker.getSessionGeneration(),
      ).toBe(5);
    });

    it("invalidates session by incrementing sessionGeneration", () => {
      expect(
        defaultSessionTracker.getSessionGeneration(),
      ).toBe(0);

      defaultSessionTracker.invalidateSession();

      expect(
        defaultSessionTracker.getSessionGeneration(),
      ).toBe(1);
    });
  });

  describe("createSessionGuard", () => {
    it("captures current generation and returns isValid = true when generation is unchanged", () => {
      let generation = 1;
      const tracker = {
        getSessionGeneration: () => generation,
      };

      const guard = createSessionGuard(tracker);

      expect(guard.capturedGeneration).toBe(1);
      expect(guard.isValid()).toBe(true);
    });

    it("returns isValid = false when generation changes", () => {
      let generation = 1;
      const tracker = {
        getSessionGeneration: () => generation,
      };

      const guard = createSessionGuard(tracker);

      expect(guard.isValid()).toBe(true);

      generation = 2;

      expect(guard.isValid()).toBe(false);
    });
  });
});
