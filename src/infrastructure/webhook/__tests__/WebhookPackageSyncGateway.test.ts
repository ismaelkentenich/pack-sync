import { AuthTokenProvider } from "@features/auth/domain/auth.token-provider";
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
  let mockTokenProvider: jest.Mocked<AuthTokenProvider>;

  beforeEach(() => {
    mockTokenProvider = {
      getIdToken: jest
        .fn()
        .mockResolvedValue("fake-firebase-token"),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("builds the delivered payload from the Package snapshot, passes Authorization header and abort signal", async () => {
    const clearTimeoutSpy = jest.spyOn(
      globalThis,
      "clearTimeout",
    );

    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
        status: 200,
      } as Response);

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );

    const pkg = createPackage({
      code: "PKG-001",
      status: PackageStatus.DELIVERED,
      deliveryStatus: DeliveryStatus.PENDING,
      receiverName: "  João da Silva  ",
      scanned_at: "2026-08-22T12:00:00.000Z",
    });

    const result = await gateway.send(pkg);

    expect(result.success).toBe(true);
    expect(
      mockTokenProvider.getIdToken,
    ).toHaveBeenCalledWith();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/webhook",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer fake-firebase-token",
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

  it("does not include clientName for a non-delivered package but includes Authorization header", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
        status: 200,
      } as Response);

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );

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
          Authorization: "Bearer fake-firebase-token",
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

  it("returns controlled error when token provider returns null (unauthenticated session)", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const fetchMock = jest.spyOn(globalThis, "fetch");

    mockTokenProvider.getIdToken.mockResolvedValue(null);

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );
    const result = await gateway.send(createPackage());

    expect(result.success).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBe("UNAUTHORIZED");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[PackageSync][Webhook] request:auth-token-missing",
      expect.any(Object),
    );

    consoleErrorSpy.mockRestore();
  });

  it("returns controlled error when no token provider is injected", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const fetchMock = jest.spyOn(globalThis, "fetch");

    const gateway = new WebhookPackageSyncGateway();
    const result = await gateway.send(createPackage());

    expect(result.success).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBe("UNAUTHORIZED");
    expect(fetchMock).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("attempts forceRefresh and retries when server responds with 401 Unauthorized", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockTokenProvider.getIdToken
      .mockResolvedValueOnce("expired-token")
      .mockResolvedValueOnce("fresh-token");

    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );
    const result = await gateway.send(createPackage());

    expect(result.success).toBe(true);
    expect(
      mockTokenProvider.getIdToken,
    ).toHaveBeenCalledWith(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://example.test/webhook",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer fresh-token",
        },
      }),
    );

    consoleErrorSpy.mockRestore();
  });

  it("handles persistent 401 Unauthorized and logs appropriate error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );
    const result = await gateway.send(createPackage());

    expect(result.success).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBe("UNAUTHORIZED");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[PackageSync][Webhook] request:unauthorized-error",
      expect.any(Object),
    );

    consoleErrorSpy.mockRestore();
  });

  it("handles 403 Forbidden and logs appropriate error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 403,
    } as Response);

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );
    const result = await gateway.send(createPackage());

    expect(result.success).toBe(false);
    expect(result.status).toBe(403);
    expect(result.error).toBe("FORBIDDEN");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[PackageSync][Webhook] request:forbidden-error",
      expect.any(Object),
    );

    consoleErrorSpy.mockRestore();
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

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
      3000,
    );
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

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );
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

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );
    const result = await gateway.send(createPackage());

    expect(result.success).toBe(false);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });

  it("uses DEFAULT_SYNC_TIMEOUT_MS when no timeout is configured", async () => {
    const setTimeoutSpy = jest.spyOn(
      globalThis,
      "setTimeout",
    );

    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
    } as Response);

    const gateway = new WebhookPackageSyncGateway(
      mockTokenProvider,
    );
    await gateway.send(createPackage());

    expect(setTimeoutSpy).toHaveBeenCalledWith(
      expect.any(Function),
      DEFAULT_SYNC_TIMEOUT_MS,
    );
  });
});
