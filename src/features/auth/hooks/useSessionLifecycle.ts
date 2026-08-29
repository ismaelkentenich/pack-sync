import { useEffect, useRef } from "react";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { usePackageStore } from "@features/packages/store/usePackageStore";

export function useSessionLifecycle(): void {
  const userId = useAuthStore((state) => state.user?.id);
  const previousUserIdRef = useRef<string | undefined>(
    userId,
  );

  useEffect(() => {
    const previousUserId = previousUserIdRef.current;

    if (previousUserId !== userId) {
      usePackageStore.getState().clearUserState();
      previousUserIdRef.current = userId;
    }
  }, [userId]);
}
