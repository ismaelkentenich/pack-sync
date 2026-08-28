import { WEBSOCKET_URL } from "@env";
import {
  PackageSyncGateway,
  PackageSyncResult,
} from "@features/packages/domain/package-sync.gateway";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";

export const DEFAULT_SYNC_TIMEOUT_MS = 10_000;

export class WebhookPackageSyncGateway implements PackageSyncGateway {
  constructor(
    private readonly timeoutMs: number = DEFAULT_SYNC_TIMEOUT_MS,
    private readonly url: string = WEBSOCKET_URL,
  ) {}

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
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
      const isTimeout =
        (error instanceof Error &&
          error.name === "AbortError") ||
        controller.signal.aborted;

      if (isTimeout) {
        console.error(
          "[PackageSync][Webhook] request:timeout-error",
          {
            packageId: pkg.id,
            packageCode: pkg.code,
            timeoutMs: this.timeoutMs,
          },
        );
      } else {
        console.error(
          "[PackageSync][Webhook] request:network-error",
          {
            packageId: pkg.id,
            packageCode: pkg.code,
            error,
          },
        );
      }

      return {
        success: false,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
