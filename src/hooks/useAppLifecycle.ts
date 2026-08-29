import { usePersistedAuth } from "@features/auth/hooks/usePersistedAuth";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { useNetworkSync } from "@features/packages/hooks/useNetworkSync";
import { useSessionLifecycle } from "../app/session/useSessionLifecycle";

export function useAppLifecycle() {
  const userId = useAuthStore((state) => state.user?.id);
  const { isRestoring } = usePersistedAuth();

  useSessionLifecycle();
  useNetworkSync(isRestoring ? undefined : userId);

  return {
    isRestoring,
  };
}
