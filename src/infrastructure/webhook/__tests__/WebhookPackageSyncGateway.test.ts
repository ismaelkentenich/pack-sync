import { AuthTokenProvider } from "@features/auth/domain/auth.token-provider";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { WebhookPackageSyncGateway } from "../WebhookPackageSyncGateway";

describe("WebhookPackageSyncGateway", () => {
  let mockAuthTokenProvider: jest.Mocked<AuthTokenProvider>;
  const mockPackage: Package = {
    id: "pkg-1",
    code: "PKG-001",
    clientCode: "user-1",
    status: PackageStatus.COLLECTED,
    deliveryStatus: DeliveryStatus.PENDING,
    scanned_at: "2026-08-31T10:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthTokenProvider = {
      getIdToken: jest
        .fn()
        .mockResolvedValue("valid-token"),
    };
    global.fetch = jest.fn();
  });

  it("initializes with default options when none are provided", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const gateway = new WebhookPackageSyncGateway(
      mockAuthTokenProvider,
    );
    const result = await gateway.send(mockPackage);

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer valid-token",
        }),
      }),
    );
  });

  it("uses custom url and timeoutMs provided in options object", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const gateway = new WebhookPackageSyncGateway(
      mockAuthTokenProvider,
      {
        url: "https://custom.api.test/sync",
        timeoutMs: 5000,
      },
    );

    const result = await gateway.send(mockPackage);

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://custom.api.test/sync",
      expect.any(Object),
    );
  });

  it("returns UNAUTHORIZED if authTokenProvider fails to return a token", async () => {
    mockAuthTokenProvider.getIdToken.mockResolvedValueOnce(
      null,
    );

    const gateway = new WebhookPackageSyncGateway(
      mockAuthTokenProvider,
    );
    const result = await gateway.send(mockPackage);

    expect(result).toEqual({
      success: false,
      status: 401,
      error: "UNAUTHORIZED",
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("attempts to refresh token and retries request on initial 401 response", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

    mockAuthTokenProvider.getIdToken
      .mockResolvedValueOnce("expired-token")
      .mockResolvedValueOnce("refreshed-token");

    const gateway = new WebhookPackageSyncGateway(
      mockAuthTokenProvider,
    );
    const result = await gateway.send(mockPackage);

    expect(
      mockAuthTokenProvider.getIdToken,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockAuthTokenProvider.getIdToken,
    ).toHaveBeenLastCalledWith(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result.success).toBe(true);
  });
});
