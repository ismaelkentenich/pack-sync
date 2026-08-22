import { usePackageStore } from "@features/packages/store/usePackageStore";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";

export function useNetworkSync(userId?: string) {
  const syncPendingPackages = usePackageStore(
    (state) => state.syncPendingPackages,
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = NetInfo.addEventListener(
      (state) => {
        if (state.isConnected) {
          syncPendingPackages(userId);
        }
      },
    );

    return unsubscribe;
  }, [syncPendingPackages, userId]);
}
