import { Package } from "@features/packages/domain/package.types";
import { WEBSOCKET_URL } from "@env";
import { PackageStatus } from "@features/packages/domain/package.enums";

export async function sendToWebhook(
  pkg: Package,
  receiverName?: string,
) {
  try {
    const payload = {
      code: pkg.code,
      clientName:
        pkg.status === PackageStatus.ENTREGUE
          ? receiverName || undefined
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

    if (!response.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
}
