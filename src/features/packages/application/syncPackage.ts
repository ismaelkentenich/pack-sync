import { Package } from "@features/packages/domain/package.types";
import { packageService as defaultPackageService } from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
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
      "syncPackage" | "getAllPackages" | "getPendingCount"
    >;
    store?: Pick<
      PackageState,
      | "syncingPackageIds"
      | "markPackageSyncing"
      | "unmarkPackageSyncing"
      | "setPackages"
    >;
  } = {},
) {
  const service =
    dependencies.packageService ?? defaultPackageService;
  const store =
    dependencies.store ?? usePackageStore.getState();

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
    const result = await service.syncPackage(pkg);
    return result;
  } finally {
    if (packageId !== undefined) {
      store.unmarkPackageSyncing(packageId);
    }
    loadPackages(userId, {
      packageService: service,
      store,
    });
  }
}
