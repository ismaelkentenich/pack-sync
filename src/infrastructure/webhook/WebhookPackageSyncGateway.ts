import { WEBSOCKET_URL } from "@env";
import {
  PackageSyncGateway,
  PackageSyncResult,
} from "@features/packages/domain/package-sync.gateway";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";

export class WebhookPackageSyncGateway implements PackageSyncGateway {
  async send(pkg: Package): Promise<PackageSyncResult> {
    try {
      const payload = {
        code: pkg.code,
        clientName:
          pkg.status === PackageStatus.ENTREGUE
            ? pkg.receiverName?.trim() || undefined
            : undefined,
        status: pkg.status,
        deliveryStatus: pkg.deliveryStatus,
        scanned_at: pkg.scanned_at,
      };

      const response = await fetch(WEBSOCKET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return {
        success: response.ok,
      };
    } catch {
      return {
        success: false,
      };
    }
  }
}
