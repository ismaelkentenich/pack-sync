import { useEffect, useState } from "react";
import { authService } from "@features/auth/auth.dependencies";
import { useAuthStore } from "@features/auth/store/useAuthStore";

export function usePersistedAuth() {
  const setUser = useAuthStore((state) => state.setUser);

  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let initialStateResolved = false;

    const finishInitialRestore = () => {
      if (initialStateResolved) {
        return;
      }

      initialStateResolved = true;
      setIsRestoring(false);
    };

    const unsubscribe = authService.observeAuthState(
      (user) => {
        setUser(user);
        finishInitialRestore();
      },
      (error) => {
        console.error(
          "[Auth] Failed to restore session:",
          error,
        );

        setUser(null);
        finishInitialRestore();
      },
    );

    return unsubscribe;
  }, [setUser]);

  return {
    isRestoring,
  };
}
