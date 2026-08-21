import { useEffect, useState } from "react";
import { useAuthStore } from "@features/auth/store/useAuthStore";

export function usePersistedAuth() {
  const { restoreSession, isAuthenticated } =
    useAuthStore();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    async function restore() {
      try {
        await restoreSession();
      } catch (error) {
        console.error(
          "[usePersistedAuth] Failed to restore session:",
          error,
        );
      } finally {
        setIsRestoring(false);
      }
    }
    restore();
  }, [restoreSession]);

  return { isRestoring, isAuthenticated };
}
