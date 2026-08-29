import { useCallback } from "react";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { packageService } from "@features/packages/package.dependencies";
import { usePackageStore } from "@features/packages/store/usePackageStore";

export function usePackageOperations() {
  const setPackages = usePackageStore(
    (state) => state.setPackages,
  );
  const addToSession = usePackageStore(
    (state) => state.addToSession,
  );
  const removeFromSession = usePackageStore(
    (state) => state.removeFromSession,
  );
  const resetSession = usePackageStore(
    (state) => state.resetSession,
  );
  const setSessionPackages = usePackageStore(
    (state) => state.setSessionPackages,
  );
  const markPackageSyncing = usePackageStore(
    (state) => state.markPackageSyncing,
  );
  const unmarkPackageSyncing = usePackageStore(
    (state) => state.unmarkPackageSyncing,
  );
  const setSyncingSession = usePackageStore(
    (state) => state.setSyncingSession,
  );
  const setSyncingPending = usePackageStore(
    (state) => state.setSyncingPending,
  );

  const loadPackages = useCallback(
    (userId: string) => {
      const packages =
        packageService.getAllPackages(userId);
      const pendingCount =
        packageService.getPendingCount(userId);
      setPackages(packages, pendingCount);
    },
    [setPackages],
  );

  const scanPackage = useCallback(
    async (
      code: string,
      userId: string,
    ): Promise<Package> => {
      const newPackage = await packageService.scanPackage(
        code,
        userId,
      );
      addToSession(newPackage);
      loadPackages(userId);
      return newPackage;
    },
    [addToSession, loadPackages],
  );

  const changeStatus = useCallback(
    (
      id: string,
      userId: string,
      status: PackageStatus,
      receiverName?: string,
    ) => {
      try {
        packageService.changePackageStatus(
          id,
          userId,
          status,
          receiverName,
        );
        loadPackages(userId);
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [loadPackages],
  );

  const deletePackage = useCallback(
    (packageId: string, userId: string) => {
      try {
        packageService.deletePackage(packageId, userId);
        removeFromSession(packageId);
        loadPackages(userId);
      } catch (error) {
        console.error(
          "[PackageOperations] deletePackage:error",
          {
            packageId,
            userId,
            error,
          },
        );
      }
    },
    [loadPackages, removeFromSession],
  );

  const sendPackage = useCallback(
    async (pkg: Package, userId: string) => {
      const packageId = pkg.id;
      if (
        packageId !== undefined &&
        usePackageStore
          .getState()
          .syncingPackageIds.includes(packageId)
      ) {
        return { success: false };
      }

      if (packageId !== undefined) {
        markPackageSyncing(packageId);
      }

      try {
        const result =
          await packageService.syncPackage(pkg);
        return result;
      } finally {
        if (packageId !== undefined) {
          unmarkPackageSyncing(packageId);
        }
        loadPackages(userId);
      }
    },
    [
      loadPackages,
      markPackageSyncing,
      unmarkPackageSyncing,
    ],
  );

  const syncPendingPackages = useCallback(
    async (userId: string) => {
      if (usePackageStore.getState().isSyncingPending) {
        return;
      }

      setSyncingPending(true);
      try {
        await packageService.syncPendingPackages(userId);
      } catch (error) {
        console.error(
          "[PackageOperations] syncPendingPackages:error",
          {
            userId,
            error,
          },
        );
      } finally {
        setSyncingPending(false);
        loadPackages(userId);
      }
    },
    [loadPackages, setSyncingPending],
  );

  const sendAllCurrentSessionPackages = useCallback(
    async (userId: string) => {
      const currentSessionPackages =
        usePackageStore.getState().currentSessionPackages;
      if (
        currentSessionPackages.length === 0 ||
        usePackageStore.getState().isSyncingSession
      ) {
        return;
      }

      setSyncingSession(true);
      try {
        const result =
          await packageService.sendMultiplePackages(
            currentSessionPackages,
          );
        loadPackages(userId);
        if (result.success) {
          resetSession();
        } else if (result.data) {
          const failedPackageIds = new Set(
            result.data.failedPackages.flatMap((p) =>
              p.id !== undefined ? [p.id] : [],
            ),
          );
          const persistedFailed = usePackageStore
            .getState()
            .packages.filter(
              (p) =>
                p.id !== undefined &&
                failedPackageIds.has(p.id),
            );
          setSessionPackages(
            persistedFailed.length > 0
              ? persistedFailed
              : result.data.failedPackages,
          );
        }
        return result;
      } finally {
        setSyncingSession(false);
      }
    },
    [
      loadPackages,
      resetSession,
      setSessionPackages,
      setSyncingSession,
    ],
  );

  const updateAndSendCurrentSessionPackages = useCallback(
    async (
      userId: string,
      status: PackageStatus,
      receiverName?: string,
    ) => {
      const currentSessionPackages =
        usePackageStore.getState().currentSessionPackages;
      if (
        currentSessionPackages.length === 0 ||
        usePackageStore.getState().isSyncingSession
      ) {
        return { success: false, sent: 0, failed: 0 };
      }

      setSyncingSession(true);
      try {
        const result =
          await packageService.updateAndSendMultiple(
            currentSessionPackages,
            userId,
            status,
            receiverName,
          );
        loadPackages(userId);
        if (result.success) {
          resetSession();
        } else if (result.data) {
          const failedPackageIds = new Set(
            result.data.failedPackages.flatMap((p) =>
              p.id !== undefined ? [p.id] : [],
            ),
          );
          const persistedFailed = usePackageStore
            .getState()
            .packages.filter(
              (p) =>
                p.id !== undefined &&
                failedPackageIds.has(p.id),
            );
          setSessionPackages(
            persistedFailed.length > 0
              ? persistedFailed
              : result.data.failedPackages,
          );
        }
        return {
          success: result.success,
          sent: result.data?.sent ?? 0,
          failed: result.data?.failed ?? 0,
        };
      } catch {
        return {
          success: false,
          sent: 0,
          failed: currentSessionPackages.length,
        };
      } finally {
        setSyncingSession(false);
      }
    },
    [
      loadPackages,
      resetSession,
      setSessionPackages,
      setSyncingSession,
    ],
  );

  return {
    loadPackages,
    scanPackage,
    changeStatus,
    deletePackage,
    sendPackage,
    syncPendingPackages,
    sendAllCurrentSessionPackages,
    updateAndSendCurrentSessionPackages,
    removeFromSession,
    resetSession,
  };
}
