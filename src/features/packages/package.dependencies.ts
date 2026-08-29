import { SQLitePackageRepository } from "@infrastructure/database/packages/SQLitePackageRepository";
import { auth } from "@infrastructure/firebase/config";
import { FirebaseAuthTokenProvider } from "@infrastructure/firebase/FirebaseAuthTokenProvider";
import { WebhookPackageSyncGateway } from "@infrastructure/webhook/WebhookPackageSyncGateway";
import { PackageService } from "./services/PackageService";

const packageRepository = new SQLitePackageRepository();
const authTokenProvider = new FirebaseAuthTokenProvider(
  auth,
);
const packageSyncGateway = new WebhookPackageSyncGateway(
  authTokenProvider,
);

export const packageService = new PackageService(
  packageRepository,
  packageSyncGateway,
);
