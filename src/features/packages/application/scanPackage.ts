import {
  createSessionGuard,
  SessionTracker,
} from "@app/session/sessionTracker";
import { Package } from "@features/packages/domain/package.types";
import { packageService as defaultPackageService } from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
import {
  PackageState,
  usePackageStore,
} from "@features/packages/store/usePackageStore";
import { loadPackages } from "./loadPackages";

export async function scanPackage(
  code: string,
  userId: string,
  dependencies: {
    packageService?: Pick<
      PackageService,
      "scanPackage" | "getAllPackages" | "getPendingCount"
    >;
    store?: Pick<
      PackageState,
      "addToSession" | "setPackages"
    >;
    sessionTracker?: Pick<
      SessionTracker,
      "getSessionGeneration"
    >;
  } = {},
): Promise<Package> {
  const service =
    dependencies.packageService ?? defaultPackageService;
  const store =
    dependencies.store ?? usePackageStore.getState();
  const guard = createSessionGuard(
    dependencies.sessionTracker,
  );

  const newPackage = await service.scanPackage(
    code,
    userId,
  );

  if (!guard.isValid()) {
    return newPackage;
  }

  store.addToSession(newPackage);
  loadPackages(userId, {
    packageService: service,
    store,
    sessionTracker: dependencies.sessionTracker,
  });
  return newPackage;
}
