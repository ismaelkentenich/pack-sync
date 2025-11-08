import { markPackageSent } from "@services/database/packages/packages";
import { Package } from "@services/database/packages/packages";

const WEBHOOK_URL = "https://webhook.site/61fbbf64-22f0-49f0-9ecf-a9a71137d3a6";

export async function sendToWebhook(pkg: Package) {
  try {
    const payload = {
      code: pkg.code,
      clientName: pkg.status === "Entregue" ? `Cliente ${pkg.clientCode}` : undefined,
      status: pkg.status,
      deliveryStatus: pkg.deliveryStatus,
      scanned_at: pkg.scanned_at,
    };

    console.log("Enviando payload para webhook:", payload);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      markPackageSent(pkg.id!);
      return { success: true };
    } else {
      console.error("Erro ao enviar webhook:", await response.text());
      return { success: false };
    }
  } catch (err) {
    console.error("Falha no envio para webhook:", err);
    return { success: false };
  }
}
