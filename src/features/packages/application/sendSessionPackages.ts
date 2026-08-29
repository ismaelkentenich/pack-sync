import { packageService as defaultPackageService } from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
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
      | "sendMultiplePackages"
      | "getAllPackages"
      | "getPendingCount"
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
  } = {},
) {
  const service =
    dependencies.packageService ?? defaultPackageService;
  const store =
    dependencies.store ?? usePackageStore.getState();

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
    const result = await service.sendMultiplePackages(
      currentSessionPackages,
    );
    loadPackages(userId, {
      packageService: service,
      store,
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
