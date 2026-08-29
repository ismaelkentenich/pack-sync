import { WEBSOCKET_URL } from "@env";
import { AuthTokenProvider } from "@features/auth/domain/auth.token-provider";
import {
  PackageSyncGateway,
  PackageSyncResult,
} from "@features/packages/domain/package-sync.gateway";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";

export const DEFAULT_SYNC_TIMEOUT_MS = 10_000;

export class WebhookPackageSyncGateway implements PackageSyncGateway {
  private readonly authTokenProvider?: AuthTokenProvider;
  private readonly timeoutMs: number;
  private readonly url: string;

  constructor(
    authTokenProviderOrTimeout?: AuthTokenProvider | number,
    timeoutMs: number = DEFAULT_SYNC_TIMEOUT_MS,
    url: string = WEBSOCKET_URL,
  ) {
    if (typeof authTokenProviderOrTimeout === "number") {
      this.authTokenProvider = undefined;
      this.timeoutMs = authTokenProviderOrTimeout;
      this.url =
        typeof timeoutMs === "string"
          ? timeoutMs
          : WEBSOCKET_URL;
    } else {
      this.authTokenProvider = authTokenProviderOrTimeout;
      this.timeoutMs = timeoutMs;
      this.url = url;
    }
  }

  async send(pkg: Package): Promise<PackageSyncResult> {
    if (!this.authTokenProvider) {
      console.error(
        "[PackageSync][Webhook] request:auth-token-missing",
        {
          packageId: pkg.id,
          packageCode: pkg.code,
        },
      );
      return {
        success: false,
        status: 401,
        error: "UNAUTHORIZED",
      };
    }

    let token = await this.authTokenProvider.getIdToken();

    if (!token) {
      console.error(
        "[PackageSync][Webhook] request:auth-token-missing",
        {
          packageId: pkg.id,
          packageCode: pkg.code,
        },
      );
      return {
        success: false,
        status: 401,
        error: "UNAUTHORIZED",
      };
    }

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

    let controller = new AbortController();
    let timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      let response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (response.status === 401) {
        const refreshedToken =
          await this.authTokenProvider.getIdToken(true);
        if (refreshedToken && refreshedToken !== token) {
          token = refreshedToken;
          clearTimeout(timeoutId);
          controller = new AbortController();
          timeoutId = setTimeout(() => {
            controller.abort();
          }, this.timeoutMs);

          response = await fetch(this.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          console.error(
            "[PackageSync][Webhook] request:unauthorized-error",
            {
              packageId: pkg.id,
              packageCode: pkg.code,
              status: 401,
            },
          );
          return {
            success: false,
            status: 401,
            error: "UNAUTHORIZED",
          };
        }

        if (response.status === 403) {
          console.error(
            "[PackageSync][Webhook] request:forbidden-error",
            {
              packageId: pkg.id,
              packageCode: pkg.code,
              status: 403,
            },
          );
          return {
            success: false,
            status: 403,
            error: "FORBIDDEN",
          };
        }

        console.error(
          "[PackageSync][Webhook] request:http-error",
          {
            packageId: pkg.id,
            packageCode: pkg.code,
            status: response.status,
          },
        );

        return {
          success: false,
          status: response.status,
          error: "HTTP_ERROR",
        };
      }

      return {
        success: true,
        status: response.status,
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
        error: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
