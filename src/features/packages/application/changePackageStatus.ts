import { PackageStatus } from "@features/packages/domain/package.enums";
import { packageService as defaultPackageService } from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
import {
  PackageState,
  usePackageStore,
} from "@features/packages/store/usePackageStore";
import { loadPackages } from "./loadPackages";

export function changePackageStatus(
  id: string,
  userId: string,
  status: PackageStatus,
  receiverName?: string,
  dependencies: {
    packageService?: Pick<
      PackageService,
      | "changePackageStatus"
      | "getAllPackages"
      | "getPendingCount"
    >;
    store?: Pick<PackageState, "setPackages">;
  } = {},
): { success: boolean } {
  const service =
    dependencies.packageService ?? defaultPackageService;
  const store =
    dependencies.store ?? usePackageStore.getState();

  try {
    service.changePackageStatus(
      id,
      userId,
      status,
      receiverName,
    );
    loadPackages(userId, {
      packageService: service,
      store,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
