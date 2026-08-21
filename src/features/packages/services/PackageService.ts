import {
  DeliveryStatus,
  PackageStatus,
} from "../../../infrastructure/database/packages/enums";
import { packageRepository } from "../../../infrastructure/database/packages/PackageRepository";
import { Package } from "../../../infrastructure/database/packages/packages";
import { sendToWebhook } from "../../../infrastructure/webhook/sendToWebhook";

export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class PackageService {
  async scanPackage(
    code: string,
    userId: string,
  ): Promise<Package> {
    const existing = packageRepository.findByCode(
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

    return packageRepository.create(pkgToInsert);
  }

  changePackageStatus(
    id: number,
    status: PackageStatus,
    clientCode?: string,
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

    packageRepository.updateStatus(
      id,
      status,
      clientCode,
      receiverName,
    );
  }

  async sendPackageToWebhook(
    pkg: Package,
    receiverName?: string,
  ): Promise<ServiceResult> {
    try {
      const result = await sendToWebhook(pkg, receiverName);

      if (result.success && pkg.id) {
        packageRepository.markAsSent(pkg.id);
        return { success: true };
      }

      return {
        success: false,
        error: `Falha ao enviar pacote ${pkg.code}`,
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
    ServiceResult<{ sent: number; failed: number }>
  > {
    let sent = 0;
    let failed = 0;

    for (const pkg of packages) {
      const result = await this.sendPackageToWebhook(
        pkg,
        receiverName,
      );
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    return {
      success: failed === 0,
      data: { sent, failed },
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
      packageRepository.findByDeliveryStatus(
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
        syncedCount++;
      }
    }

    return {
      success: true,
      data: syncedCount,
    };
  }

  getAllPackages(userId: string): Package[] {
    return packageRepository.findAllByUser(userId);
  }

  getPendingCount(userId: string): number {
    return packageRepository.countByDeliveryStatus(
      userId,
      DeliveryStatus.PENDING,
    );
  }

  filterPackages(
    packages: Package[],
    searchTerm: string,
    statusFilter?: string,
  ): Package[] {
    return packages.filter((pkg) => {
      const codeMatch = this.normalizeText(
        pkg.code,
      ).includes(this.normalizeText(searchTerm));
      const statusMatch = statusFilter
        ? pkg.status === statusFilter
        : true;
      return codeMatch && statusMatch;
    });
  }

  async updateAndSendMultiple(
    packages: Package[],
    status: PackageStatus,
    receiverName?: string,
  ): Promise<
    ServiceResult<{ sent: number; failed: number }>
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
      const packageIds = packages
        .map((p) => p.id!)
        .filter((id) => id !== undefined);
      packageRepository.batchUpdateStatus(
        packageIds,
        status,
        receiverName,
      );

      const updatedPackages = packages.map((pkg) => ({
        ...pkg,
        status,
        receiverName,
      }));

      const sendResult = await this.sendMultiplePackages(
        updatedPackages,
        receiverName,
      );

      return sendResult;
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

export const packageService = new PackageService();
