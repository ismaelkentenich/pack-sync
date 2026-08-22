import { PackageSyncGateway } from "@features/packages/domain/package-sync.gateway";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import {
  PackageError,
  PackageErrorCode,
} from "@features/packages/domain/package.errors";
import { PackageRepository } from "@features/packages/domain/package.repository";
import { Package } from "@features/packages/domain/package.types";

export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: PackageError;
};

export class PackageService {
  private readonly packageSyncInFlight = new Map<
    string,
    Promise<ServiceResult>
  >();

  private readonly pendingSyncInFlight = new Map<
    string,
    Promise<ServiceResult<number>>
  >();

  constructor(
    private readonly packageRepository: PackageRepository,
    private readonly packageSyncGateway: PackageSyncGateway,
  ) {}

  async scanPackage(
    code: string,
    userId: string,
  ): Promise<Package> {
    const existing = this.packageRepository.findByCode(
      code,
      userId,
    );

    if (existing) {
      throw new PackageError(
        PackageErrorCode.ALREADY_SCANNED,
      );
    }

    const pkgToInsert: Package = {
      code,
      status: PackageStatus.COLETADO,
      deliveryStatus: DeliveryStatus.PENDING,
      clientCode: userId,
      scanned_at: new Date().toISOString(),
    };

    return this.packageRepository.create(pkgToInsert);
  }

  changePackageStatus(
    id: number,
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): void {
    if (
      status === PackageStatus.ENTREGUE &&
      !receiverName?.trim()
    ) {
      throw new PackageError(
        PackageErrorCode.RECEIVER_REQUIRED,
      );
    }

    this.packageRepository.updateStatus(
      id,
      userId,
      status,
      receiverName,
    );
  }

  syncPackage(pkg: Package): Promise<ServiceResult> {
    const packageId = pkg.id;

    if (packageId === undefined) {
      return Promise.resolve({
        success: false,
        error: new PackageError(
          PackageErrorCode.INVALID_FOR_SYNC,
        ),
      });
    }

    const syncKey = `${pkg.clientCode}:${packageId}`;
    const inFlight = this.packageSyncInFlight.get(syncKey);

    if (inFlight) {
      return inFlight;
    }

    const operation = this.performPackageSync(
      pkg,
      packageId,
    );

    const trackedOperation = operation.finally(() => {
      if (
        this.packageSyncInFlight.get(syncKey) ===
        trackedOperation
      ) {
        this.packageSyncInFlight.delete(syncKey);
      }
    });

    this.packageSyncInFlight.set(syncKey, trackedOperation);
    return trackedOperation;
  }

  private async runPackageSync(
    pkg: Package,
    packageId: number,
    syncKey: string,
  ): Promise<ServiceResult> {
    try {
      return await this.performPackageSync(pkg, packageId);
    } finally {
      this.packageSyncInFlight.delete(syncKey);
    }
  }

  private async performPackageSync(
    pkg: Package,
    packageId: number,
  ): Promise<ServiceResult> {
    try {
      const packageToSync = this.packageRepository.findById(
        packageId,
        pkg.clientCode,
      );

      if (!packageToSync) {
        return {
          success: false,
          error: new PackageError(
            PackageErrorCode.INVALID_FOR_SYNC,
          ),
        };
      }

      if (
        packageToSync.status === PackageStatus.ENTREGUE &&
        !packageToSync.receiverName?.trim()
      ) {
        return {
          success: false,
          error: new PackageError(
            PackageErrorCode.RECEIVER_REQUIRED,
          ),
        };
      }

      const result =
        await this.packageSyncGateway.send(packageToSync);

      if (!result.success) {
        return {
          success: false,
          error: new PackageError(
            PackageErrorCode.SYNC_FAILED,
            {
              code: packageToSync.code,
            },
          ),
        };
      }

      this.packageRepository.markAsSent(
        packageId,
        packageToSync.clientCode,
      );

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: new PackageError(
          PackageErrorCode.SYNC_FAILED,
          {
            code: pkg.code,
          },
        ),
      };
    }
  }

  async sendMultiplePackages(packages: Package[]): Promise<
    ServiceResult<{
      sent: number;
      failed: number;
    }>
  > {
    let sent = 0;
    let failed = 0;

    for (const pkg of packages) {
      const result = await this.syncPackage(pkg);

      if (result.success) {
        sent += 1;
      } else {
        failed += 1;
      }
    }

    return {
      success: failed === 0,
      data: {
        sent,
        failed,
      },
      error:
        failed > 0
          ? new PackageError(
              PackageErrorCode.MULTIPLE_SYNC_FAILED,
              {
                count: failed,
              },
            )
          : undefined,
    };
  }

  syncPendingPackages(
    userId: string,
  ): Promise<ServiceResult<number>> {
    const inFlight = this.pendingSyncInFlight.get(userId);

    if (inFlight) {
      return inFlight;
    }

    const operation = this.performPendingSync(userId);
    const trackedOperation = operation.finally(() => {
      if (
        this.pendingSyncInFlight.get(userId) ===
        trackedOperation
      ) {
        this.pendingSyncInFlight.delete(userId);
      }
    });

    this.pendingSyncInFlight.set(userId, trackedOperation);
    return trackedOperation;
  }

  private async performPendingSync(
    userId: string,
  ): Promise<ServiceResult<number>> {
    const pendingPackages =
      this.packageRepository.findByDeliveryStatus(
        userId,
        DeliveryStatus.PENDING,
      );

    if (pendingPackages.length === 0) {
      return {
        success: true,
        data: 0,
      };
    }

    let syncedCount = 0;

    for (const pkg of pendingPackages) {
      const result = await this.syncPackage(pkg);
      if (result.success) {
        syncedCount += 1;
      }
    }
    return {
      success: true,
      data: syncedCount,
    };
  }

  getAllPackages(userId: string): Package[] {
    return this.packageRepository.findAllByUser(userId);
  }

  getPendingCount(userId: string): number {
    return this.packageRepository.countByDeliveryStatus(
      userId,
      DeliveryStatus.PENDING,
    );
  }

  filterPackages(
    packages: Package[],
    searchTerm: string,
    statusFilter?: string,
  ): Package[] {
    const normalizedSearchTerm =
      this.normalizeText(searchTerm);

    return packages.filter((pkg) => {
      const codeMatches = this.normalizeText(
        pkg.code,
      ).includes(normalizedSearchTerm);

      const statusMatches = statusFilter
        ? pkg.status === statusFilter
        : true;

      return codeMatches && statusMatches;
    });
  }

  async updateAndSendMultiple(
    packages: Package[],
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): Promise<
    ServiceResult<{
      sent: number;
      failed: number;
    }>
  > {
    if (
      status === PackageStatus.ENTREGUE &&
      !receiverName?.trim()
    ) {
      return {
        success: false,
        error: new PackageError(
          PackageErrorCode.RECEIVER_REQUIRED,
        ),
      };
    }

    try {
      const packageIds = packages.flatMap((pkg) =>
        pkg.id !== undefined ? [pkg.id] : [],
      );

      this.packageRepository.batchUpdateStatus(
        packageIds,
        userId,
        status,
        receiverName,
      );

      return this.sendMultiplePackages(packages);
    } catch {
      return {
        success: false,
        error: new PackageError(PackageErrorCode.UNKNOWN),
      };
    }
  }

  private normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }
}
