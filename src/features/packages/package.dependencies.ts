import { SQLitePackageRepository } from "@infrastructure/database/packages/SQLitePackageRepository";
import { WebhookPackageSyncGateway } from "@infrastructure/webhook/WebhookPackageSyncGateway";
import { PackageService } from "./services/PackageService";

const packageRepository = new SQLitePackageRepository();

const packageSyncGateway = new WebhookPackageSyncGateway();

export const packageService = new PackageService(
  packageRepository,
  packageSyncGateway,
);
