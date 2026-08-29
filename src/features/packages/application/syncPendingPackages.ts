import {
  createSessionGuard,
  SessionTracker,
} from "@features/auth/session/sessionTracker";
import { packageService as defaultPackageService } from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
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
      | "syncPendingPackages"
      | "getAllPackages"
      | "getPendingCount"
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
    await service.syncPendingPackages(userId);
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
