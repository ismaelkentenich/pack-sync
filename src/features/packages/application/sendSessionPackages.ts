import {
  createSessionGuard,
  SessionTracker,
} from "@features/auth/session/sessionTracker";
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

export async function sendSessionPackages(
  userId: string,
  dependencies: {
    packageService?: Pick<
      PackageService,
      "getAllPackages" | "getPendingCount"
    >;
    packageSyncService?: Pick<
      PackageSyncService,
      "sendMultiplePackages"
    >;
    store?: Pick<
      PackageState,
      | "currentSessionPackages"
      | "isSyncingSession"
      | "packages"
      | "setSyncingSession"
      | "resetSession"
      | "setSessionPackages"
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

  const currentSessionPackages =
    store.currentSessionPackages;
  if (
    currentSessionPackages.length === 0 ||
    store.isSyncingSession
  ) {
    return;
  }

  store.setSyncingSession(true);
  try {
    const result = await syncService.sendMultiplePackages(
      currentSessionPackages,
    );
    if (!guard.isValid()) {
      return result;
    }
    loadPackages(userId, {
      packageService: service,
      store,
      sessionTracker: dependencies.sessionTracker,
    });
    if (result.success) {
      store.resetSession();
    } else if (result.data) {
      const failedPackageIds = new Set(
        result.data.failedPackages.flatMap((p) =>
          p.id !== undefined ? [p.id] : [],
        ),
      );
      const persistedFailed = (
        dependencies.store?.packages ??
        usePackageStore.getState().packages
      ).filter(
        (p) =>
          p.id !== undefined && failedPackageIds.has(p.id),
      );
      store.setSessionPackages(
        persistedFailed.length > 0
          ? persistedFailed
          : result.data.failedPackages,
      );
    }
    return result;
  } finally {
    store.setSyncingSession(false);
  }
}
