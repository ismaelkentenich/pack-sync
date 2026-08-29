import {
  createSessionGuard,
  SessionTracker,
} from "@features/auth/session/sessionTracker";
import { Package } from "@features/packages/domain/package.types";
import {
  packageService as defaultPackageService,
  packageSyncService as defaultPackageSyncService,
} from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
import { PackageSyncService } from "@features/packages/services/PackageSyncService";
import {
  PackageState,
  usePackageStore,
} from "@features/packages/store/usePackageStore";
import { loadPackages } from "./loadPackages";

export async function syncPackage(
  pkg: Package,
  userId: string,
  dependencies: {
    packageService?: Pick<
      PackageService,
      "getAllPackages" | "getPendingCount"
    >;
    packageSyncService?: Pick<
      PackageSyncService,
      "syncPackage"
    >;
    store?: Pick<
      PackageState,
      | "syncingPackageIds"
      | "markPackageSyncing"
      | "unmarkPackageSyncing"
      | "setPackages"
    >;
    sessionTracker?: Pick<
      SessionTracker,
      "getSessionGeneration"
    >;
  } = {},
) {
  const service =
    dependencies.packageService ?? defaultPackageService;
  const syncService =
    dependencies.packageSyncService ??
    defaultPackageSyncService;
  const store =
    dependencies.store ?? usePackageStore.getState();
  const guard = createSessionGuard(
    dependencies.sessionTracker,
  );

  const packageId = pkg.id;
  if (
    packageId !== undefined &&
    store.syncingPackageIds.includes(packageId)
  ) {
    return { success: false };
  }

  if (packageId !== undefined) {
    store.markPackageSyncing(packageId);
  }

  try {
    const result = await syncService.syncPackage(pkg);
    return result;
  } finally {
    if (packageId !== undefined) {
      store.unmarkPackageSyncing(packageId);
    }
    if (guard.isValid()) {
      loadPackages(userId, {
        packageService: service,
        store,
        sessionTracker: dependencies.sessionTracker,
      });
    }
  }
}
