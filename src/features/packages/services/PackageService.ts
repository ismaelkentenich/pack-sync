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
  constructor(
    private readonly packageRepository: PackageRepository,
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
      status: PackageStatus.COLLECTED,
      deliveryStatus: DeliveryStatus.PENDING,
      clientCode: userId,
      scanned_at: new Date().toISOString(),
    };

    return this.packageRepository.create(pkgToInsert);
  }

  changePackageStatus(
    id: string,
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): void {
    if (
      status === PackageStatus.DELIVERED &&
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

  deletePackage(id: string, userId: string): void {
    this.packageRepository.delete(id, userId);
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

  private normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }
}
