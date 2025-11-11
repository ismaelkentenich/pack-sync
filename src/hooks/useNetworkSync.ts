import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { usePackageStore } from "@store/packages/usePackageStore";

export function useNetworkSync() {
  const syncPendingPackages = usePackageStore((s) => s.syncPendingPackages);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncPendingPackages();
      }
    });
    return () => unsubscribe();
  }, [syncPendingPackages]);
}
