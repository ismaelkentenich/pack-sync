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
import { ServiceResult } from "./PackageService";

export type { ServiceResult };

export type BatchSyncResult = {
  sent: number;
  failed: number;
  failedPackages: Package[];
};

export class PackageSyncService {
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

  private async performPackageSync(
    pkg: Package,
    packageId: string,
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
        packageToSync.status === PackageStatus.DELIVERED &&
        !packageToSync.receiverName?.trim()
      ) {
        return {
          success: false,
          error: new PackageError(
            PackageErrorCode.RECEIVER_REQUIRED,
          ),
        };
      }

      const syncVersion = packageToSync.syncVersion ?? 1;

      const result =
        await this.packageSyncGateway.send(packageToSync);

      if (!result.success) {
        let errorCode = PackageErrorCode.SYNC_FAILED;
        if (
          result.status === 401 ||
          result.error === "UNAUTHORIZED"
        ) {
          errorCode = PackageErrorCode.UNAUTHORIZED;
        } else if (
          result.status === 403 ||
          result.error === "FORBIDDEN"
        ) {
          errorCode = PackageErrorCode.FORBIDDEN;
        }

        return {
          success: false,
          error: new PackageError(errorCode, {
            code: packageToSync.code,
          }),
        };
      }

      this.packageRepository.markAsSent(
        packageId,
        packageToSync.clientCode,
        syncVersion,
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

  async sendMultiplePackages(
    packages: Package[],
  ): Promise<ServiceResult<BatchSyncResult>> {
    let sent = 0;
    let failed = 0;

    const failedPackages: Package[] = [];

    for (const pkg of packages) {
      const result = await this.syncPackage(pkg);

      if (result.success) {
        sent += 1;

        continue;
      }

      failed += 1;
      failedPackages.push(pkg);

      console.error(
        "[PackageSync][Service] sendMultiplePackages:item-failed",
        {
          id: pkg.id,
          code: pkg.code,
          error: result.error,
        },
      );
    }

    return {
      success: failed === 0,
      data: {
        sent,
        failed,
        failedPackages,
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
      console.log(
        "[PackageSync][Service] performPendingSync:nothing-to-sync",
        {
          userId,
        },
      );

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

  async updateAndSendMultiple(
    packages: Package[],
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): Promise<ServiceResult<BatchSyncResult>> {
    if (
      status === PackageStatus.DELIVERED &&
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
}
