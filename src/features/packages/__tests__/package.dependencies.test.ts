import {
  createPackageDependencies,
  packageService,
  packageSyncService,
} from "../package.dependencies";
import { PackageService } from "../services/PackageService";
import { PackageSyncService } from "../services/PackageSyncService";

jest.mock(
  "@infrastructure/database/packages/SQLitePackageRepository",
);
jest.mock("@infrastructure/firebase/config", () => ({
  auth: {},
}));
jest.mock(
  "@infrastructure/firebase/FirebaseAuthTokenProvider",
);
jest.mock(
  "@infrastructure/webhook/WebhookPackageSyncGateway",
);

describe("package.dependencies composition root", () => {
  it("exports default singleton instances", () => {
    expect(packageService).toBeInstanceOf(PackageService);
    expect(packageSyncService).toBeInstanceOf(
      PackageSyncService,
    );
  });

  it("creates fresh dependency instances when createPackageDependencies is called", () => {
    const deps1 = createPackageDependencies();
    const deps2 = createPackageDependencies();

    expect(deps1.packageService).toBeInstanceOf(
      PackageService,
    );
    expect(deps1.packageSyncService).toBeInstanceOf(
      PackageSyncService,
    );

    expect(deps2.packageService).toBeInstanceOf(
      PackageService,
    );
    expect(deps2.packageSyncService).toBeInstanceOf(
      PackageSyncService,
    );

    expect(deps1.packageService).not.toBe(
      deps2.packageService,
    );
    expect(deps1.packageSyncService).not.toBe(
      deps2.packageSyncService,
    );
  });
});
