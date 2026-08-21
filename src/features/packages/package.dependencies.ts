import { SQLitePackageRepository } from "@infrastructure/database/packages/SQLitePackageRepository";
import { PackageService } from "./services/PackageService";

const packageRepository = new SQLitePackageRepository();

export const packageService = new PackageService(
  packageRepository,
);
