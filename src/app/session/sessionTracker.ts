import { useAuthStore } from "@features/auth/store/useAuthStore";

export interface SessionTracker {
  getSessionGeneration: () => number;
  invalidateSession: () => void;
}

export const defaultSessionTracker: SessionTracker = {
  getSessionGeneration: () =>
    useAuthStore.getState().sessionGeneration,
  invalidateSession: () =>
    useAuthStore.getState().invalidateSession(),
};

export interface SessionGuard {
  capturedGeneration: number;
  isValid: () => boolean;
}

export function createSessionGuard(
  sessionTrackerDep: Pick<
    SessionTracker,
    "getSessionGeneration"
  > = defaultSessionTracker,
): SessionGuard {
  const capturedGeneration =
    sessionTrackerDep.getSessionGeneration();
  return {
    capturedGeneration,
    isValid: () =>
      sessionTrackerDep.getSessionGeneration() ===
      capturedGeneration,
  };
}
