import { markPackageSent } from "@services/database/packages/packages";
import { Package } from "@services/database/packages/packages";
import { WEBSOCKET_URL } from "@env";
import { PackageStatus } from "@services/database/packages/enums";

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
