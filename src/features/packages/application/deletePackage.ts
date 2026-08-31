import { packageService as defaultPackageService } from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
import {
  PackageState,
  usePackageStore,
} from "@features/packages/store/usePackageStore";
import { loadPackages } from "./loadPackages";

export function deletePackage(
  packageId: string,
  userId: string,
  dependencies: {
    packageService?: Pick<
      PackageService,
      "deletePackage" | "getAllPackages" | "getPendingCount"
    >;
    store?: Pick<
      PackageState,
      "removeFromSession" | "setPackages"
    >;
  } = {},
): void {
  const service =
    dependencies.packageService ?? defaultPackageService;
  const store =
    dependencies.store ?? usePackageStore.getState();

  try {
    service.deletePackage(packageId, userId);
    store.removeFromSession(packageId);
    loadPackages(userId, {
      packageService: service,
      store,
    });
  } catch (error) {
    console.error(
      "[PackageApplication] deletePackage:error",
      {
        packageId,
        userId,
        error,
      },
    );
  }
}
