import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { PackageRepository } from "@features/packages/domain/package.repository";
import { Package } from "@features/packages/domain/package.types";
import { sendToWebhook } from "@infrastructure/webhook/sendToWebhook";

export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
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
      throw new Error("Pacote já escaneado");
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
      throw new Error(
        "Nome do recebedor é obrigatório para pacotes entregues",
      );
    }

    this.packageRepository.updateStatus(
      id,
      userId,
      status,
      receiverName,
    );
  }

  async sendPackageToWebhook(
    pkg: Package,
    receiverName?: string,
  ): Promise<ServiceResult> {
    if (pkg.id === undefined) {
      return {
        success: false,
        error: "Pacote inválido para sincronização",
      };
    }

    try {
      const result = await sendToWebhook(pkg, receiverName);

      if (!result.success) {
        return {
          success: false,
          error: `Falha ao enviar pacote ${pkg.code}`,
        };
      }

      this.packageRepository.markAsSent(
        pkg.id,
        pkg.clientCode,
      );

      return {
        success: true,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro desconhecido";

      return {
        success: false,
        error: `Erro ao enviar pacote: ${message}`,
      };
    }
  }

  async sendMultiplePackages(
    packages: Package[],
    receiverName?: string,
  ): Promise<
    ServiceResult<{
      sent: number;
      failed: number;
    }>
  > {
    let sent = 0;
    let failed = 0;

    for (const pkg of packages) {
      const result = await this.sendPackageToWebhook(
        pkg,
        receiverName,
      );

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
          ? `${failed} pacote(s) falharam ao enviar`
          : undefined,
    };
  }

  async syncPendingPackages(
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
      const result = await this.sendPackageToWebhook(pkg);

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
        error:
          "Nome do recebedor é obrigatório para pacotes entregues",
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

      const updatedPackages = packages.map((pkg) => ({
        ...pkg,
        status,
        receiverName,
      }));

      return this.sendMultiplePackages(
        updatedPackages,
        receiverName,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro desconhecido";

      return {
        success: false,
        error: message,
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
