import { useCallback } from "react";
import * as application from "@features/packages/application";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { usePackageStore } from "@features/packages/store/usePackageStore";

export function usePackageOperations() {
  const removeFromSession = usePackageStore(
    (state) => state.removeFromSession,
  );
  const resetSession = usePackageStore(
    (state) => state.resetSession,
  );

  const loadPackages = useCallback((userId: string) => {
    application.loadPackages(userId);
  }, []);

  const scanPackage = useCallback(
    async (
      code: string,
      userId: string,
    ): Promise<Package> => {
      return application.scanPackage(code, userId);
    },
    [],
  );

  const changeStatus = useCallback(
    (
      id: string,
      userId: string,
      status: PackageStatus,
      receiverName?: string,
    ) => {
      return application.changePackageStatus(
        id,
        userId,
        status,
        receiverName,
      );
    },
    [],
  );

  const deletePackage = useCallback(
    (packageId: string, userId: string) => {
      application.deletePackage(packageId, userId);
    },
    [],
  );

  const sendPackage = useCallback(
    async (pkg: Package, userId: string) => {
      return application.syncPackage(pkg, userId);
    },
    [],
  );

  const syncPendingPackages = useCallback(
    async (userId: string) => {
      return application.syncPendingPackages(userId);
    },
    [],
  );

  const sendAllCurrentSessionPackages = useCallback(
    async (userId: string) => {
      return application.sendSessionPackages(userId);
    },
    [],
  );

  const updateAndSendCurrentSessionPackages = useCallback(
    async (
      userId: string,
      status: PackageStatus,
      receiverName?: string,
    ) => {
      return application.updateSessionPackages(
        userId,
        status,
        receiverName,
      );
    },
    [],
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
