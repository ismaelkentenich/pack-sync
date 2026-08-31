import { SQLitePackageRepository } from "@infrastructure/database/packages/SQLitePackageRepository";
import { auth } from "@infrastructure/firebase/config";
import { FirebaseAuthTokenProvider } from "@infrastructure/firebase/FirebaseAuthTokenProvider";
import { WebhookPackageSyncGateway } from "@infrastructure/webhook/WebhookPackageSyncGateway";
import { PackageService } from "./services/PackageService";
import { PackageSyncService } from "./services/PackageSyncService";

export type PackageDependencies = {
  packageService: PackageService;
  packageSyncService: PackageSyncService;
};

export function createPackageDependencies(): PackageDependencies {
  const packageRepository = new SQLitePackageRepository();
  const authTokenProvider = new FirebaseAuthTokenProvider(
    auth,
  );
  const packageSyncGateway = new WebhookPackageSyncGateway(
    authTokenProvider,
  );

  return {
    packageService: new PackageService(packageRepository),
    packageSyncService: new PackageSyncService(
      packageRepository,
      packageSyncGateway,
    ),
  };
}

const defaultDependencies = createPackageDependencies();

export const packageService =
  defaultDependencies.packageService;

export const packageSyncService =
  defaultDependencies.packageSyncService;
