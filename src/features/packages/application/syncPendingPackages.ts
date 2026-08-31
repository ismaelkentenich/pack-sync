import {
  createSessionGuard,
  SessionTracker,
} from "@app/session/sessionTracker";
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

export async function syncPendingPackages(
  userId: string,
  dependencies: {
    packageService?: Pick<
      PackageService,
      "getAllPackages" | "getPendingCount"
    >;
    packageSyncService?: Pick<
      PackageSyncService,
      "syncPendingPackages"
    >;
    store?: Pick<
      PackageState,
      | "isSyncingPending"
      | "setSyncingPending"
      | "setPackages"
    >;
    sessionTracker?: Pick<
      SessionTracker,
      "getSessionGeneration"
    >;
  } = {},
): Promise<void> {
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

  if (store.isSyncingPending) {
    return;
  }

  store.setSyncingPending(true);
  try {
    await syncService.syncPendingPackages(userId);
  } catch (error) {
    console.error(
      "[PackageApplication] syncPendingPackages:error",
      {
        userId,
        error,
      },
    );
  } finally {
    store.setSyncingPending(false);
    if (guard.isValid()) {
      loadPackages(userId, {
        packageService: service,
        store,
        sessionTracker: dependencies.sessionTracker,
      });
    }
  }
}
