import { WEBSOCKET_URL } from "@env";
import {
  PackageSyncGateway,
  PackageSyncResult,
} from "@features/packages/domain/package-sync.gateway";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";

export class WebhookPackageSyncGateway implements PackageSyncGateway {
  async send(pkg: Package): Promise<PackageSyncResult> {
    const payload = {
      code: pkg.code,
      clientName:
        pkg.status === PackageStatus.DELIVERED
          ? pkg.receiverName?.trim() || undefined
          : undefined,
      status: pkg.status,
      deliveryStatus: pkg.deliveryStatus,
      scanned_at: pkg.scanned_at,
    };

    try {
      const response = await fetch(WEBSOCKET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(
          "[PackageSync][Webhook] request:http-error",
          {
            packageId: pkg.id,
            packageCode: pkg.code,
            status: response.status,
          },
        );
      }

      return {
        success: response.ok,
      };
    } catch (error) {
      console.error(
        "[PackageSync][Webhook] request:network-error",
        {
          packageId: pkg.id,
          packageCode: pkg.code,
          error,
        },
      );

      return {
        success: false,
      };
    }
  }
}
