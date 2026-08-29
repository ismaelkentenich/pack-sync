import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { usePackageOperations } from "@features/packages/hooks/usePackageOperations";

export function useNetworkSync(userId?: string) {
  const { syncPendingPackages } = usePackageOperations();

  useEffect(() => {
    if (!userId) {
      return;
    }

    let disposed = false;
    let wasConnected: boolean | null = null;
    let currentAppState: AppStateStatus =
      AppState.currentState;

    const syncCurrentUser = () => {
      if (disposed) {
        return;
      }

      const currentUserId =
        useAuthStore.getState().user?.id;

      if (currentUserId !== userId) {
        console.warn(
          "[PackageSync][Network] skipped-user-changed",
          {
            expectedUserId: userId,
            currentUserId,
          },
        );

        return;
      }

      syncPendingPackages(userId);
    };

    const reconcileIfConnected = async () => {
      const state = await NetInfo.fetch();
      if (disposed) {
        return;
      }
      wasConnected = state.isConnected === true;
      if (wasConnected) {
        syncCurrentUser();
      }
    };

    reconcileIfConnected();

    const unsubscribeNetwork = NetInfo.addEventListener(
      (state) => {
        const isConnected = state.isConnected === true;
        const reconnected =
          isConnected && wasConnected === false;

        wasConnected = isConnected;

        if (reconnected) {
          syncCurrentUser();
        }
      },
    );

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        const becameActive =
          currentAppState !== "active" &&
          nextAppState === "active";

        currentAppState = nextAppState;

        if (becameActive) {
          reconcileIfConnected();
        }
      },
    );

    return () => {
      disposed = true;
      unsubscribeNetwork();
      appStateSubscription.remove();
    };
  }, [syncPendingPackages, userId]);
}
