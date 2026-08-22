import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { createPackage } from "@test";
import { WebhookPackageSyncGateway } from "../WebhookPackageSyncGateway";

describe("WebhookPackageSyncGateway", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("builds the delivered payload from the Package snapshot", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
      } as Response);

    const gateway = new WebhookPackageSyncGateway();

    const pkg = createPackage({
      code: "PKG-001",
      status: PackageStatus.ENTREGUE,
      deliveryStatus: DeliveryStatus.PENDING,
      receiverName: "  João da Silva  ",
      scanned_at: "2026-08-22T12:00:00.000Z",
    });

    const result = await gateway.send(pkg);

    expect(result.success).toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/webhook",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: "PKG-001",
          clientName: "João da Silva",
          status: PackageStatus.ENTREGUE,
          deliveryStatus: DeliveryStatus.PENDING,
          scanned_at: "2026-08-22T12:00:00.000Z",
        }),
      },
    );
  });

  it("does not include clientName for a non-delivered package", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
      } as Response);

    const gateway = new WebhookPackageSyncGateway();

    const pkg = createPackage({
      status: PackageStatus.COLETADO,
      receiverName: "Should not be sent",
    });

    const result = await gateway.send(pkg);

    expect(result.success).toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/webhook",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: pkg.code,
          status: PackageStatus.COLETADO,
          deliveryStatus: DeliveryStatus.PENDING,
          scanned_at: pkg.scanned_at,
        }),
      },
    );
  });

  it("returns failure when the webhook responds with a non-success status", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
    } as Response);

    const gateway = new WebhookPackageSyncGateway();

    const result = await gateway.send(createPackage());

    expect(result.success).toBe(false);
  });

  it("returns failure when fetch throws", async () => {
    jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("Network unavailable"));

    const gateway = new WebhookPackageSyncGateway();

    const result = await gateway.send(createPackage());

    expect(result.success).toBe(false);
  });
});
