import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { createPackage } from "@test";
import {
  DEFAULT_SYNC_TIMEOUT_MS,
  WebhookPackageSyncGateway,
} from "../WebhookPackageSyncGateway";

describe("WebhookPackageSyncGateway", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("builds the delivered payload from the Package snapshot and passes abort signal", async () => {
    const clearTimeoutSpy = jest.spyOn(
      globalThis,
      "clearTimeout",
    );

    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
      } as Response);

    const gateway = new WebhookPackageSyncGateway();

    const pkg = createPackage({
      code: "PKG-001",
      status: PackageStatus.DELIVERED,
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
          status: PackageStatus.DELIVERED,
          deliveryStatus: DeliveryStatus.PENDING,
          scanned_at: "2026-08-22T12:00:00.000Z",
        }),
        signal: expect.any(AbortSignal),
      },
    );

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  });

  it("does not include clientName for a non-delivered package", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
      } as Response);

    const gateway = new WebhookPackageSyncGateway();

    const pkg = createPackage({
      status: PackageStatus.COLLECTED,
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
          status: PackageStatus.COLLECTED,
          deliveryStatus: DeliveryStatus.PENDING,
          scanned_at: pkg.scanned_at,
        }),
        signal: expect.any(AbortSignal),
      },
    );
  });

  it("aborts request and logs timeout error when deadline is exceeded", async () => {
    const clearTimeoutSpy = jest.spyOn(
      globalThis,
      "clearTimeout",
    );
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const abortError = new Error(
      "The operation was aborted",
    );
    abortError.name = "AbortError";

    jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(abortError);

    const gateway = new WebhookPackageSyncGateway(3000);
    const pkg = createPackage({
      id: "pkg-1",
      code: "PKG-001",
    });

    const result = await gateway.send(pkg);

    expect(result.success).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[PackageSync][Webhook] request:timeout-error",
      {
        packageId: "pkg-1",
        packageCode: "PKG-001",
        timeoutMs: 3000,
      },
    );
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });

  it("distinguishes timeout error from generic network error", async () => {
    const clearTimeoutSpy = jest.spyOn(
      globalThis,
      "clearTimeout",
    );
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const networkError = new Error("Network unavailable");

    jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(networkError);

    const gateway = new WebhookPackageSyncGateway();
    const pkg = createPackage({
      id: "pkg-2",
      code: "PKG-002",
    });

    const result = await gateway.send(pkg);

    expect(result.success).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[PackageSync][Webhook] request:network-error",
      {
        packageId: "pkg-2",
        packageCode: "PKG-002",
        error: networkError,
      },
    );
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });

  it("returns failure and cleans up timer when webhook responds with non-success HTTP status", async () => {
    const clearTimeoutSpy = jest.spyOn(
      globalThis,
      "clearTimeout",
    );
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const gateway = new WebhookPackageSyncGateway();
    const result = await gateway.send(createPackage());

    expect(result.success).toBe(false);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });

  it("uses DEFAULT_SYNC_TIMEOUT_MS when no timeout is configured", () => {
    const setTimeoutSpy = jest.spyOn(
      globalThis,
      "setTimeout",
    );

    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
    } as Response);

    const gateway = new WebhookPackageSyncGateway();
    gateway.send(createPackage());

    expect(setTimeoutSpy).toHaveBeenCalledWith(
      expect.any(Function),
      DEFAULT_SYNC_TIMEOUT_MS,
    );
  });
});
