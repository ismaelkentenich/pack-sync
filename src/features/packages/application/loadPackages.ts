import { SessionTracker } from "@features/auth/session/sessionTracker";
import { packageService as defaultPackageService } from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
import {
  PackageState,
  usePackageStore,
} from "@features/packages/store/usePackageStore";

export function loadPackages(
  userId: string,
  dependencies: {
    packageService?: Pick<
      PackageService,
      "getAllPackages" | "getPendingCount"
    >;
    store?: Pick<PackageState, "setPackages">;
    sessionTracker?: Pick<
      SessionTracker,
      "getSessionGeneration"
    >;
  } = {},
): void {
  const service =
    dependencies.packageService ?? defaultPackageService;
  const store =
    dependencies.store ?? usePackageStore.getState();

  const packages = service.getAllPackages(userId);
  const pendingCount = service.getPendingCount(userId);
  store.setPackages(packages, pendingCount);
}
